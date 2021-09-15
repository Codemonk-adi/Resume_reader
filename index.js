console.log("Welcome to JsonCV application");

let fs = require('fs');
let Path = require('path');
let PdfParser = require('pdf-parse');

let userJson = {};

let Samplefile = fs.readFileSync(Path.join(__dirname,'/Sample/SamplePdf.pdf'));

function render_page(pageData) {
    //check documents https://mozilla.github.io/pdf.js/
    let render_options = {
        //replaces all occurrences of whitespace with standard spaces (0x20). The default value is `false`.
        normalizeWhitespace: false,
        //do not attempt to combine same line TextItem's. The default value is `false`.
        disableCombineTextItems: true
    }

    return pageData.getTextContent(render_options)
        .then((textContent) => {
            let lastY, text = '';
            for (let item of textContent.items) {
                if (lastY == item.transform[5] || !lastY) {
                    text += item.str;
                }
                else {
                    text += '\n' + item.str;
                }
                lastY = item.transform[5];
            }
            return text;
        });
}

let options = {
    pagerender: render_page
}
PdfParser(Samplefile, options).then(function (data) {
    //  console.log(data.text.split("\n"));
    const userArr = data.text.split("\n");


    // entering name of the user
    let i = 0;
    while (!/^[a-z]/i.test(userArr[i]))
        i++;
    userJson.name = userArr[i];

    // entering address of the user
    let count = 0;
    let address = "";
    while (count < 5) {
        count++;
        address += userArr[i + count];
    }
    userJson.Address = address;
    i = i + count;
    while(userArr[i]!='About Me ')
    i++;
    // creating About me section
    userJson.AboutMe={};
    let about=userArr[i+1]+": ";
    i+=2;
    while(userArr[i]!=' '){
        about+=userArr[i];
        i++;
    }
    userJson.AboutMe.About=about;
    console.log(userJson);
    while(userArr[i]!=' ')
        i++;
    console.log(i);
    i+=2;
    userJson.AboutMe.Education="Education";
    

    // console.log(userJson);
    // console.log(userArr[12]);
    // console.log(userArr[13].includes("About me"));
    // let name=/[a-zA-Z](.*?)\n/g.exec(data.text)[0].trim();
    // userJson.Name=name;
    // let Address=/^[a-z]/.exec(data.text);
    // console.log(userJson);
}).catch(error => console.log(error))

