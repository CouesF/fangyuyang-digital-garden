---
{"dg-publish":true,"permalink":"/2024/software/tts/","created":"2024-08-25T18:25:50.531+08:00"}
---

主要对比内容：
1. 生成质量：整体流畅即可。
2. 生成速度：Real Time Factor（RTF）至少小于 0.5
3. 推理要求：CPU 还是 GPU，VRAM 需求多少。

| 名称                      | 离线    | 质量             | 速度 RTF      | 推理要求             | 可控性 | 链接                                                                                                                      |
| ----------------------- | ----- | -------------- | ----------- | ---------------- | --- | ----------------------------------------------------------------------------------------------------------------------- |
| Edge TTS                | ❌     |                | 0.7         |                  |     |                                                                                                                         |
| CosyVoice-python SDKs   | ❌<br> |                |             |                  |     |                                                                                                                         |
| CosyVoice-websocket     | ❌<br> |                |             |                  |     | https://help.aliyun.com/zh/isi/developer-reference/websocket-protocol-description?spm=a2c4g.11186623.0.0.748e5757uTmjSr |
| Fish TTS                |       |                |             | GPU 4GB          |     | https://speech.fish.audio/                                                                                              |
| Ekho                    | <br>  | 传统音素拼接         | <0.2        | CPU 7MB          | /   | https://www.eguidedog.net/ekho.php                                                                                      |
| Melo TTS                | <br>  |                | 官方：CPU 实时推理 |                  |     | https://github.com/myshell-ai/MeloTTS                                                                                   |
| ChatTTS                 | <br>  |                | 4090 0.3    | 占用有点大，GPU 推理。4GB |     |                                                                                                                         |
| tensorflowTTS-Tactron   | <br>  |                |             | 130MB            |     | https://github.com/Z-yq/TensorflowTTS                                                                                   |
| Paddle 工具包-fastspeech 2 |       |                |             |                  |     | https://github.com/PaddlePaddle/PaddleSpeech?tab=readme-ov-file                                                         |
| GPT‐SoVITS‐v2           |       | 效果自然           | 大概率不会快      |                  |     |                                                                                                                         |
| parlertts-880M          |       |                | 大概率也不快      |                  |     |                                                                                                                         |
| mars 5-tts 750+450M 参数  |       |                |             |                  |     |                                                                                                                         |
| emotivoice              |       |                |             |                  |     |                                                                                                                         |
| SummerTTS               |       | 效果还行，挺自然       | 1           | CPU              |     |                                                                                                                         |
| Piper-Chinese           |       | 韵律不太好          | 0.09        | 小                |     |                                                                                                                         |
| FCH-TTS (Parallel TTS)  |       | 只有英文，要重新训练中文 ` |             |                  |     | https://github.com/atomicoo/FCH-TTS<br>                                                                                 |
| `F5-TTS`                |       |                |             | 模型 1.35G         |     |                                                                                                                         |
