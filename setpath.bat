@ECHO OFF

ECHO Setting node_modules .bin to path
set binpath=%CD%
set binpath=%binpath%/node_modules/.bin
set path=%path%;%binpath%

:end
@ECHO ON