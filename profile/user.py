class User:
    def __init__(self, username: str, description: str, follow_list: list, fans_list: list):
        self.username = username
        self.description = description
        self.follow_list = follow_list
        self.fans_list = fans_list
        self.follow_num = len(self.follow_list)
        self.fans_num = len(self.fans_list)
