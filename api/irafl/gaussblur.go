package irafl

import (
    "strconv"
    "io/ioutil"
    "unsafe"

    "github.com/kataras/iris/v12"

    "gocv.io/x/gocv"
)

var GaussblurRoute string = "/irafl/gaussblur"

var GaussblurFunc func(ctx iris.Context) = func(ctx iris.Context) {
    file, _, _ := ctx.FormFile("file")
    defer file.Close()
    radius, _ := strconv.Atoi(ctx.URLParams()["r"])
    streamSrc, _ := ioutil.ReadAll(file)
    img, _ := gocv.IMDecode(streamSrc, gocv.IMReadColor)
    if img.Channels() == 3 {
        gocv.CvtColor(img, &img, gocv.ColorBGRToBGRA)
    }
    data := img.ToBytes()
    res := make([]byte, img.Cols() * img.Rows() * 4)
    execute(res, data, img.Cols(), img.Rows(), 2, unsafe.Pointer(&radius))
    out, _ := gocv.NewMatFromBytes(img.Rows(), img.Cols(), img.Type(), res)
    streamDst, _ := gocv.IMEncode(gocv.PNGFileExt, out)
    ctx.Binary(streamDst)
}
