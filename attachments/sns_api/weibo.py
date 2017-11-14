import requests
import time

WEIBO_CONTENT_LIMIT = 140


class Weibo:
    def __init__(self, app_id: str, app_secret: str, call_back_url: str) -> None:
        """
        初始化

        :param app_id: 新浪微博提供的APP_ID
        :param app_secret: 新浪微博提供的APP_SECRET
        :param call_back_url: 用户授权后新浪调用的回调地址
        """
        self.app_id = app_id
        self.app_secret = app_secret
        self.call_back_url = call_back_url
        self.access_token = None
        self.access_token_expire_unix = None

    def get_request_url(self) -> str:
        """    
        获得用户登录与授权页面的地址

        :return: 用户登录与授权页面地址
        """
        url = ("https://api.weibo.com/oauth2/authorize?client_id={id}&response_type=code&redirect_uri={url}"
               .format(id=self.app_id, url=self.call_back_url))
        return url

    def get_access_token_from_code(self, code: str) -> None:
        """
        根据回调得到的code换取access_token

        :param code: 用户在登录与授权页面授权后，新浪回调提供的回调地址所提供的参数code
        """
        url = "https://api.weibo.com/oauth2/access_token?client_id={id}&client_secret={secret}" \
              "&grant_type=authorization_code&redirect_uri={callback}&code={code}".format(
            id=self.app_id, secret=self.app_secret, callback=self.call_back_url, code=code)
        try:
            respond = requests.post(url)
        except Exception as e:
            raise Exception("与验证服务器换取ACCESS TOKEN失败")
        result = respond.json()
        if "access_token" in result:
            self.access_token = result["access_token"]
            self.access_token_expire_unix = result["expires_in"] + time.time()
        else:
            raise Exception("验证服务器返回值非法")

    def post_link(self, link: str, addition_text: str) -> None:
        """
        通过微博分享链接

        :param link: 需要发送的链接(必须包含回调链接域名相同)
        :param addition_text: 发送链接时附带的文字信息(与链接总长度应少于140字)
        """
        content = addition_text + link
        if len(content) >= WEIBO_CONTENT_LIMIT:
            raise Exception("微博长度过长")
        if self.access_token is None:
            raise Exception("未获取ACCESS TOKEN")
        if (self.access_token_expire_unix is not None) and time.time() > self.access_token_expire_unix:
            raise Exception("ACCESS TOKEN已过期")
        data = {"access_token": self.access_token, "status": content}
        respond = requests.post("https://api.weibo.com/2/statuses/share.json", data=data)
        if not respond.ok:
            raise Exception("微博发送失败")

    def set_access_token(self, access_token: str) -> None:
        """
        手动设置ACCESS TOKEN

        :param access_token: 需要设置的ACCESS TOKEN
        """
        self.access_token = access_token
        self.access_token_expire_unix = None

    def get_access_token(self) -> str:
        """
        获取当前ACCESS TOKEN

        :return: 当前ACCESS TOKEN
        """
        return self.access_token

    def get_access_token_expire_time(self) -> int:
        """
        获取当前ACCESS TOKEN失效时间

        :return: 当前ACCESS TOKEN失效时间
        """
        return self.access_token_expire_unix


if __name__ == '__main__':
    weibo = Weibo(app_id="1901211326", app_secret="cdb104f16ef85731ce8176a4ac0854eb",
                  call_back_url="http://symphony.yuhong-zhong.com")
    request_url = weibo.get_request_url()  # 获取用户授权URL，将用户重定向至该URL
    code = "2a3d85c68306f2eda86fbb31433c2e42"  # 用户完成授权后回调给出的回调URL，从回调URL中获得参数code
    weibo.get_access_token_from_code(code)  # 由code向新浪获取access token
    weibo.post_link(link="http://symphony.yuhong-zhong.com", addition_text="API测试")  # 发送含链接的微博
