#install lxml and requests
#install requests
from lxml import html
import requests
page = requests.get('http://econpy.pythonanywhere.com/ex/001.html') #requests.get to retrieve the web page with our data 
tree = html.fromstring(page.content) #page.content because html.fromstring imports the data explicityly as butes
buyers = tree.xpath('//div[@title="buyer-name"]/text()')
prices = tree.xpath('//span[@class="item-price"]/text()')
print 'Buyers : ', buyers
