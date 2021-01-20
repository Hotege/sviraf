package api

/*
#cgo CFLAGS: -I../../../cxx/irafl/build/install/include
#cgo LDFLAGS: -L../../../cxx/irafl/build/install/lib -lirafl
#include <irafl_wrapper.h>
*/
import "C"

import (
    "github.com/kataras/iris/v12"

    "sviraf/api/irafl"
)

var APIRoute string = "/api"

var APIGroup func(users iris.Party) = func(users iris.Party) {
    users.Get("/version", func(ctx iris.Context) {
        ctx.Text(C.GoString(C.IRAFL_Info()))
    })
    users.Post(irafl.GrayRoute, irafl.GrayFunc)
    users.Post(irafl.GaussblurRoute, irafl.GaussblurFunc)
    users.Post(irafl.VoronoiRoute, irafl.VoronoiFunc)
}
