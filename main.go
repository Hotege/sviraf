package main

/*
#cgo CFLAGS: -I../../cxx/irafl/build/install/include
#cgo LDFLAGS: -L../../cxx/irafl/build/install/lib -lirafl
#include <irafl_wrapper.h>
*/
import "C"

import (
    "github.com/kataras/iris/v12"
    "github.com/kataras/iris/v12/middleware/logger"
    "github.com/kataras/iris/v12/middleware/recover"

    "sviraf/api"
)

func main() {
    C.IRAFL_Initialize()

    app := iris.New()
    app.Use(recover.New())
    app.Use(logger.New())
    app.PartyFunc(api.APIRoute, api.APIGroup)
    app.Run(iris.Addr(":62934"))
    C.IRAFL_Terminate()
}