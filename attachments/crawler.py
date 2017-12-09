import urllib.parse
import requests
from bs4 import BeautifulSoup
import pickle

movie_name_file = open("./movie_name.txt", "r")
movie_name_content = movie_name_file.read()
movie_name_file.close()
movie_name_list = movie_name_content.split("\n")


def search_url_generator(movie_name):
    movie_name_encode = urllib.parse.quote_plus(movie_name)
    url = "http://www.imdb.com/find?ref_=nv_sr_fn&q={}&s=all".format(movie_name_encode)
    return url


description_dict = dict()
video_dict = dict()
agent = r"Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/62.0.3202.94 Safari/537.36"
headers = {"User-Agent": agent}

for movie_name in movie_name_list:
    search_url = search_url_generator(movie_name)
    search_respond = requests.get(search_url)
    search_respond.encoding = search_respond.apparent_encoding
    search_html_str = search_respond.content
    search_soup = BeautifulSoup(search_html_str, "lxml")
    content_href = search_soup.find("td", class_="result_text").a.get("href")
    content_url = "http://www.imdb.com" + content_href
    content_respond = requests.get(content_url, headers=headers)
    content_respond.encoding = content_respond.apparent_encoding
    content_html_str = content_respond.content
    content_soup = BeautifulSoup(content_html_str, "lxml")
    description = str(content_soup.find("div", class_="summary_text").next_element).strip()
    if not content_soup.find("a", class_="slate_button") is None:
        video = "http://www.imdb.com" + content_soup.find("a", class_="slate_button").get("href")
    else:
        video = ""
    description_dict[movie_name] = description
    video_dict[movie_name] = video

description_file = open("./movie_description.bin", "wb")
video_file = open("./movie_video.bin", "wb")
pickle.dump(description_dict, description_file)
pickle.dump(video_dict, video_file)
description_file.close()
video_file.close()
