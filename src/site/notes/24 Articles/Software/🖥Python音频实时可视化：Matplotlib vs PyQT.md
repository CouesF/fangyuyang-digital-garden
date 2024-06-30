---
{"dg-publish":true,"permalink":"/24-articles/software/python-matplotlib-vs-py-qt/","tags":["python","Audio_Processing"],"created":"2024-06-30T15:59:39.896+08:00"}
---

想学习些实时音频处理相关知识，第一步就是想把音频数据实时可视化出来，但是发现无论如何都有 0.6s 左右的延迟。
测试后主要问题有以下几个：
1. 采样率：使用 PyAudio 时，采样率只能选择特定采样率，比如 44100 Hz
2. 绘图速度：PyQT 比 Matplotlib 的 FuncAnimation 快
3. 多线程：尽量使用多线程，将可视化和数据获取分线程处理

修改后代码：
```python
import pyaudio
import numpy as np
import pyqtgraph as pg
from pyqtgraph.Qt import QtGui, QtCore, QtWidgets
from collections import deque
import threading

# 定义采样参数
FORMAT = pyaudio.paInt16  # 数据格式
CHANNELS = 1  # 单声道
RATE = 44100  # 采样率
CHUNK = 1024  # 缓冲区大小
QUEUE_SIZE = 20  # 队列中包含的chunk数量

# 初始化pyaudio
audio = pyaudio.PyAudio()

# 打开麦克风流
stream = audio.open(format=FORMAT,
                    channels=CHANNELS,
                    rate=RATE,
                    input=True,
                    frames_per_buffer=CHUNK)

# 初始化数据队列
data_queue = deque([np.zeros(CHUNK, dtype=np.int16) for _ in range(QUEUE_SIZE)], maxlen=QUEUE_SIZE)

# 锁定对象
data_lock = threading.Lock()

def audio_callback():
    while True:
        data = stream.read(CHUNK, exception_on_overflow=False)
        data_int = np.frombuffer(data, dtype=np.int16)
        with data_lock:
            data_queue.append(data_int)

app = QtWidgets.QApplication([])  # 使用QtWidgets.QApplication
win = pg.GraphicsLayoutWidget(show=True, title="Real-time Audio Visualization")
win.resize(800, 600)
win.setWindowTitle('Real-time Audio Visualization')

plot = win.addPlot(title="Audio Signal")
curve = plot.plot(pen='y')
plot.setYRange(-32768, 32767)
plot.setXRange(0, CHUNK * QUEUE_SIZE)

def update():
    with data_lock:
        full_data = np.concatenate(data_queue)
    curve.setData(full_data)

# 启动音频采集线程
audio_thread = threading.Thread(target=audio_callback)
audio_thread.daemon = True
audio_thread.start()

# 设置定时器更新图表
timer = QtCore.QTimer()
timer.timeout.connect(update)
timer.start(50)

# 开始Qt事件循环
if __name__ == '__main__':
    QtWidgets.QApplication.instance().exec_()  # 使用QtWidgets.QApplication

# 关闭流
stream.stop_stream()
stream.close()
audio.terminate()

```