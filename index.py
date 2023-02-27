import qrcode
from flask import Flask, request
import pyzbar.pyzbar as pyzbar
from selenium import webdriver
from selenium.webdriver.common.keys import Keys

app = Flask(__name__)

@app.route('/')
def index():
    qr = qrcode.QRCode(version=1, box_size=10, border=4)
    qr.add_data('https://bread-7.github.io')
    qr.make(fit=True)
    qr_img = qr.make_image(fill_color='black', back_color='white')
    qr_img.save('qr.png')
    return '<img src="/qr.png">'

@app.route('/execute')
def execute():
    # Step 2: Parse the data
    qr_data_str = request.args.get('data') # assuming the QR code data is passed as a query parameter

    # Step 3: Fill in the fields
    driver = webdriver.Chrome() # or any other browser driver you prefer
    driver.get('https://bread-7.github.io') # replace with the URL of the website you want to interact with
    field = driver.find_element_by_name('fname') # replace 'fieldname' with the name or ID of the input field you want to fill in
    field.send_keys(qr_data_str) # fill in the field with the QR code data

    # Step 4: Submit the form
    submit_button = driver.find_element_by_xpath('//button[@type="submit"]') # assuming the submit button has a 'type' attribute set to 'submit'
    submit_button.click() # submit the form

if __name__ == '__main__':
    app.run(debug=True)
