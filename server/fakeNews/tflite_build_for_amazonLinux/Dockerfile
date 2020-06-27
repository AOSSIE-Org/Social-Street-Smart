FROM amazonlinux

WORKDIR /tflite

RUN yum groupinstall -y development
RUN yum -y install zlib-devel
RUN yum -y install openssl-devel

# Build and install wget, openssl and python3.6 for amazonlinux
RUN yum install -y wget
RUN wget https://github.com/openssl/openssl/archive/OpenSSL_1_0_2l.tar.gz
RUN tar -zxvf OpenSSL_1_0_2l.tar.gz 
WORKDIR "openssl-OpenSSL_1_0_2l/"
RUN ./config shared
RUN make
RUN make install
RUN export LD_LIBRARY_PATH=/usr/local/ssl/lib/
WORKDIR ".."
RUN wget https://www.python.org/ftp/python/3.6.8/Python-3.6.8.tgz
RUN tar xzf Python-3.6.8.tgz
WORKDIR "./Python-3.6.8"
RUN ./configure
RUN make
RUN make install
WORKDIR ".."
RUN yum install -y python3-devel

RUN python3.6 -m pip -V
RUN python3.6 -m pip install numpy wheel

# Clone tf r2.1 and build it
RUN git clone --branch r2.1 https://github.com/tensorflow/tensorflow.git
RUN sh ./tensorflow/tensorflow/lite/tools/pip_package/build_pip_package.sh

# Install the wheel file
RUN pip3 install /tmp/tflite_pip/python3/dist/tflite_runtime-2.1.1-cp36-cp36m-linux_x86_64.whl

CMD tail -f /dev/null
