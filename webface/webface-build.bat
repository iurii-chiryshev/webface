@rem меняем текущую папку
cd ./static/webface

@echo ----------------------------------
@echo      Building test app...
@echo ----------------------------------
sencha.exe app build testing


@echo ----------------------------------
@echo      Building production app...
@echo ----------------------------------
sencha.exe app build production

@rem возвращаем текущую папку
cd ..
cd ..

@echo Production build completed