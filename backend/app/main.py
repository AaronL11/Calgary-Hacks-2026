import os
import logging
import time
import asyncio
from contextlib import asynccontextmanager
from typing import Optional

# Import colorama on Windows to enable ANSI colors in console.
if os.name == "nt":
    try:
        import colorama

        colorama.init()
    except Exception:
        pass

from fastapi import FastAPI, Request, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from fastapi.middleware.gzip import GZipMiddleware
from fastapi.responses import JSONResponse

from .database import connect, close
from .routers import auth, users, courses, problems, responses, search

logger = logging.getLogger("uvicorn.error")
logger.setLevel(logging.INFO)


def configure_event_loop_policy() -> None:
    """Configure event loop policy: use `winloop` on Windows, `uvloop` otherwise.

    This attempts several initialization strategies for `winloop` (different
    packages expose different APIs) and falls back gracefully to the default
    asyncio policy when unavailable. On non-Windows, prefers `uvloop`.
    """
    try:
        if os.name == "nt":
            try:
                import winloop

                # Try a few possible policy attribute names used by different
                # versions/implementations of the package.
                for attr in (
                    "WinLoopPolicy",
                    "EventLoopPolicy",
                    "WindowsSelectorEventLoopPolicy",
                ):
                    policy_cls = getattr(winloop, attr, None)
                    if policy_cls:
                        try:
                            asyncio.set_event_loop_policy(policy_cls())
                            logger.info("Using winloop policy: %s", attr)
                            return
                        except Exception:
                            continue

                # Some winloop variants expose an install() helper.
                if hasattr(winloop, "install"):
                    try:
                        winloop.install()
                        logger.info("winloop installed via winloop.install()")
                        return
                    except Exception:
                        pass
            except Exception:
                logger.debug(
                    "winloop not available or failed to initialize", exc_info=True
                )
                return
        else:
            try:
                import uvloop

                asyncio.set_event_loop_policy(uvloop.EventLoopPolicy())
                logger.info("Using uvloop EventLoopPolicy")
            except Exception:
                logger.debug(
                    "uvloop not available - using default asyncio loop", exc_info=True
                )
    except Exception:
        logger.exception("Failed to configure event loop policy")


@asynccontextmanager
async def lifespan(app: FastAPI):
    logger.info("LIFESPAN startup: connecting to database")
    await connect(app)
    try:
        yield
    finally:
        logger.info("LIFESPAN shutdown: closing database")
        await close(app)


def build_app() -> FastAPI:
    logging.basicConfig(level=logging.INFO)

    app = FastAPI(title="UArchive API", lifespan=lifespan)

    # Middleware
    app.add_middleware(GZipMiddleware, minimum_size=1000)
    app.add_middleware(
        CORSMiddleware,
        allow_origins=["*"],
        allow_credentials=True,
        allow_methods=["*"],
        allow_headers=["*"],
    )

    @app.middleware("http")
    async def request_logging(request: Request, call_next):
        start = time.perf_counter()
        response = await call_next(request)
        elapsed_ms = (time.perf_counter() - start) * 1000
        logger.info(
            f"{request.method} {request.url.path} completed_in={elapsed_ms:.2f}ms status_code={response.status_code}"
        )
        return response

    # Routers
    app.include_router(auth.router, prefix="/api/auth", tags=["auth"])
    app.include_router(users.router, prefix="/api/users", tags=["users"])
    app.include_router(courses.router, prefix="/api/courses", tags=["courses"])
    app.include_router(problems.router, prefix="/api/problems", tags=["problems"])
    app.include_router(responses.router, prefix="/api/responses", tags=["responses"])
    app.include_router(search.router, prefix="/api/search", tags=["search"])

    @app.get("/healthz", tags=["health"])
    def health_check():
        # lightweight DB check
        try:
            db = app.state.db
            # motor returns a Database object; perform a simple command
            # Note: avoid blocking calls here; keep it lightweight
            return {"status": "ok", "db": "available" if db else "unavailable"}
        except Exception:
            return {"status": "ok", "db": "unavailable"}

    return app


configure_event_loop_policy()

app = build_app()


# Uvicorn entrypoint for local dev
if __name__ == "__main__":
    import uvicorn

    uvicorn.run(
        "app.main:app",
        host="0.0.0.0",
        port=int(os.getenv("PORT", 8000)),
        log_level=os.getenv("LOG_LEVEL", "info"),
    )
