# Building Tensorflow Lite for Amazon Linux

Amazon Linux cannot natively run the Tensorflow Lite binary provided by Google. It needs to be compiled on Amazon Linux itself. 

This is based on the [work by tpaul1611](https://github.com/tpaul1611/python_tflite_for_amazonlinux) 

## Perform the following to do this

```
docker build -t tflite_amazonlinux .
docker run -d --name=tflite_amazonlinux tflite_amazonlinux
docker cp tflite_amazonlinux:/usr/local/lib64/python3.6/site-packages .
docker stop tflite_amazonlinux

```

If the above steps fail, you will have to do the following

```
docker build -t tflite_amazonlinux .
docker run -it --name=tflite_amazonlinux tflite_amazonlinux bash

```

Now you'll have a bash shell running on Amazon Linux

Perform the following

```
sh ./tensorflow/tensorflow/lite/tools/pip_package/build_pip_package.sh
pip3 install /tmp/tflite_pip/python3/dist/tflite_runtime-2.1.1-cp36-cp36m-linux_x86_64.whl
cd /tmp

# Copying the Wheel
zip -r tflite.zip ./tflite_pip
curl tflite.zip https://transfer.sh/<anything_you_want>

# Install tflite
pip3 install ./tflite_pip/python3/dist/tflite_runtime-2.1.1-cp36-cp36m-linux_x86_64

cd /usr/local/lib64/python3.6/
zip -r site-packages.zip site-packages
curl site-packages.zip https://transfer.sh/<anything_you_want>

```

Now you dowload these two files to your computer, extract, get the binaries and deploy them

