@setlocal enableextensions & python -x %~f0 %* & goto :EOF
from pixelweb.pixelweb import startServer
startServer()
