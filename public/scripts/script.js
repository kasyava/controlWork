
let lastDate='';
let globalArray = [];

let msgList, errorMsg, author, textMessage;
let squarespaceModal;
let baseURL;


$(function(){
    baseURL = location.href;

    msgList = $('#msgList');
    errorMsg = $('#errorMsg');
    author = $('#author');
    textMessage = $('#textMessage');
    squarespaceModal = $("#squarespaceModal");


    $("#showForm").click((e)=>{
        e.preventDefault();
        squarespaceModal.modal('show');
    });

    squarespaceModal.on('hidden.bs.modal', function() {
        $(this).find("input,textarea,select").val('').end();

    });

    $('#btnSendMessage').click((e) => {
        e.preventDefault();
        squarespaceModal.modal('hide');

        const data = new FormData(document.getElementById("formData"));
        console.log(data);
        sendAjax("POST", data)
            .then((responce) =>{
                errorMsg.empty();
            });
    });

    getAllProduct().then(responce => {
        console.log(responce);
        printMessage(responce)
    });


});


let fillArray = (data) =>{
    if(data.length) {
        for (let i = 0; i < data.length; i++) {
            globalArray.push(data[i]);
        }
    }
    printMessage(globalArray);
    //console.log(globalArray);
};


let printMessage = (data) =>{
    console.log(data);
    let list = "";

    let container = $('#msgList');

    $('#wrapper').append(container);
    data.forEach((element) => {
        /*let myDate = element.datetime.split('T')[0];
        let myTime = element.datetime.split('T')[1].split('.')[0];*/

        let div = $('<div id="mess" class="col">');
        let form = $('<form>');
        form.attr("id", element.id);
        let name = $('<input type="text">').val(element.name);
        let description = $('<input type="text">').val(element.description);
        let price = $('<input type="number">').val(element.price);
        let button = $('<button>').text('Save');
        if(element.image)
        {

            let image = $('<img height="150">');
            image.attr("src", "http://localhost:8000/uploads/" + element.image);

            let imgDiv = $('<div id="mess" class="message-image">');
            imgDiv.append(image);
            div.append(imgDiv);
        }
        form.append(name, '<br>', description, '<br>', price, '<br>', button);
        let divText = $('<div class="message-text">').append(form);

        div.append(divText);
        container.append(div);

        /*list+='<div class="col">';
        list+='<div class="message-author">'+ "наименование:" + element.name;
        list+='</div>';
        if(element.image)
        {
            list += '<div class="message-image"> <img height="150" src="http://127.0.0.1:8000/uploads/' + element.image + '" alt="">';
            list += '</div>';
        }
        list+='<div class="message-text">' + element.description + '</div>';
        list+='</div>';*/
    });

    // msgList.empty();
    // msgList.html(list);
};

let sendAjax=(type='GET', data='')=> {
    console.log(window.location.href);
    return $.ajax(
        {
            url: baseURL + 'products',
            type: type,
            data: data,
            processData: false,
            contentType: false,

            error: function(err) {
                errorMsg.html(err.responseJSON.error);
            }
        }
    );
};

let getAllProduct =()=> {

    return $.ajax(
        {
            url: baseURL + 'products',
            method: "GET"
        }
    );
};