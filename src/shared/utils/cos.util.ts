import { RequestParams } from '@gopowerteam/http-request'
import { appConfig } from '@/config/app.config'

import { COSControllerService } from '@/http/services/kyb-service/c-o-s-controller.service'

const importCOS = () => import('cos-js-sdk-v5')

const services = {
  default: {
    service: COSControllerService
  }
}

/**
 * 公共函数
 */
export class CosUtil {
  private readonly name: string
  private service: any
  private cosService: any
  private config

  constructor(name = 'default') {
    this.name = name
    this.service = services[name]
    this.cosService = new services[name].service()
    this.config = {
      Bucket: 'xbt-1301716714',
      Region: 'ap-chengdu',
      StorageClass: 'STANDARD'
    }
  }

  private async initCosInstance(COS, ready) {
    return new COS({
      getAuthorization: (options, callback) => {
        this.cosService
          .createTempSecret(new RequestParams())
          .subscribe(credentials => {
            callback({
              TmpSecretId: credentials.tmpSecretId,
              TmpSecretKey: credentials.tmpSecretKey,
              XCosSecurityToken: credentials.sessionToken,
              // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
              StartTime: credentials.startTime, // 时间戳，单位秒，如：1580000000
              ExpiredTime: credentials.expiredTime // 时间戳，单位秒，如：1580000900
            })
            // 初始化完成
            ready(this.service._cosInstance)
          })
      },
      FileParallelLimit: 5, // 文件并发数
      ChunkParallelLimit: 8, // 同一个上传文件的分块并发数
      ChunkSize: 1024 * 1024 * 8 // 分块上传时，每块的字节数大小
    })
  }

  /**
   * 获取cos状态
   * 支持多文件上传
   */
  public async getCosReady() {
    const { default: COS } = (await importCOS()) as any

    if (!this.service._cosInstance && !this.service._cosReady) {
      this.service._cosReady = new Promise(resolve => {
        this.service._cosInstance = this.initCosInstance(COS, resolve)
      })
      return Promise.resolve(this.service._cosInstance)
    } else {
      return this.service._cosReady
    }
  }

  /**
   * H5上传
   * @param fileObject
   */
  public pubObject(fileObject) {
    const cosReady = this.getCosReady()

    return cosReady.then(cos => {
      return new Promise<any>((reslove, rejcet) => {
        const key = Math.random().toString(32).slice(2)
        cos.putObject(
          {
            ...this.config,
            Key: key /* 必须 */,
            Body: fileObject // 上传文件对象
          },
          (err, data) => {
            if (err) {
              rejcet(err)
            } else {
              reslove(Object.assign(data, { key }))
            }
          }
        )
      })
    })
  }

  /**
   * 分片上传
   */
  public sliceUploadFile(fileObject, onProcess) {
    const cosReady = this.getCosReady()

    return cosReady.then(cos => {
      new Promise<any>((reslove, rejcet) => {
        cos.sliceUploadFile(
          {
            Bucket: this.config.Bucket, // Bucket 格式：test-1250000000
            Region: this.config.Region,
            Key: Math.random().toString(32).slice(2) /* 必须 */,
            Body: fileObject,
            onTaskReady: () => {
              // TaskId = tid
            },
            // onHashProgress: (progressData) => {},
            onProgress: progressData => {
              onProcess && onProcess(progressData)
            }
          },
          (err, data) => {
            if (err) {
              rejcet(err)
            } else {
              reslove(data)
            }
          }
        )
      })
    })
  }

  /**
   * 小程序上传
   * @param filePath
   */
  public postObject(filePath, suffix = '') {
    const cosReady = this.getCosReady()

    return cosReady.then(cos => {
      return new Promise<any>((reslove, rejcet) => {
        cos.postObject(
          {
            ...this.config,
            Key: Math.random().toString(32).slice(2) + suffix /* 必须 */,
            FilePath: filePath
          },
          (err, data) => {
            if (err) {
              rejcet(err)
            } else {
              reslove(data)
            }
          }
        )
      })
    })
  }
}
