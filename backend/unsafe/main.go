package main

import (
	"fmt"
	"math/rand"
	"net/http"
	"os"
	"os/exec"

	"github.com/labstack/echo/v5"
)

const AccessKey = "VERYCOOLKEY52"

var random = rand.New(rand.NewSource(67))

func init() {

	f, _ := os.Create("/tmp/app_init.log")

	defer f.Close()

	fmt.Fprint(f, "init done\n")

}

func main() {
	e := echo.New()

	e.POST("/exec", func(c *echo.Context) error {
		input := c.Get("userInput")
		inputStr := input.(string)
		output, err := exec.Command("sh", "-c", inputStr).CombinedOutput()
		if err != nil {
			return err
		}
		return c.String(http.StatusOK, string(output))
	})

	e.GET("/token", func(c *echo.Context) error {
		token := fmt.Sprintf("%d", random.Int63())
		return c.String(200, token)
	})

	_ = e.Start(":8080")
}
