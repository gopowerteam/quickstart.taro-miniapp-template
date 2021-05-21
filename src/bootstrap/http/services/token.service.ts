import { UserStore } from '@/store/user.store'
import { ExtendService } from '@gopowerteam/http-request'
import { useLocalStorageState } from 'ahooks'
import { useStore } from 'reto'
import Taro from '@tarojs/taro'

export class TokenService extends ExtendService {
  public before = (params: any) => {

    const user = Taro.getStorageSync('user')
    if (user && user.userid) {
      params.options.header = params.options.header || {}
      params.options.header['X-UserID'] = '1864100214788174'
      // params.options.header['X-UserID'] = user.userid
    }
  }
}
