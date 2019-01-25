
let globalArray = [];

let msgList, errorMsg, author, textMessage;
let squarespaceModal;
let baseURL;


$(() => {
    baseURL = location.href;
    msgList = $('#msgList');
    errorMsg = $('#errorMsg');
    author = $('#author');
    textMessage = $('#textMessage');
    squarespaceModal = $("#squarespaceModal");


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
        for(let i = 0; i < data.length; i++) {
            let div = $('<div id="mess" class="col">');
            let form = $('<form>');
            form.attr("id", data[i].id);
            form.attr("enctype", "multipart/form-data");
            //form.attr("method", "POST");
            let name = $(`<input type="text" name="name" id="name${i}">`).val(data[i].name);
            let description = $(`<input type="text" name="description" id="description${i}">`).val(data[i].description);
            let price = $(`<input type="number" name="price" id="price${i}">`).val(data[i].price);
            let button = $(`<button id="saveChanges${i}" type="submit">`).text('Save changes');
            if(data[i].image)
            {
                let image = $('<img height="150">');
                image.attr("src", "http://localhost:8000/uploads/" + data[i].image);

                let imgDiv = $('<div id="mess" class="message-image">');
                imgDiv.append(image);
                div.append(imgDiv);
            }
            form.append(name, '<br>', description, '<br>', price, '<br>', button);
            let divText = $('<div class="message-text">').append(form);

            div.append(divText);
            container.append(div);


            $(`#saveChanges${i}`).click((e)=>{

                e.preventDefault();
                console.log( document.getElementById('formData'));
                console.log( $(`#${data[i].id}`)[0]);
                const formData  = {
                    "id": data[i].id,
                    "name": $(`#name${i}`).val(),
                    "description": $(`#description${i}`).val(),
                    "price": $(`#price${i}`).val()
                };
                //const formData = new FormData($(`#${data[i].id}`).serializeArray());
                console.log(formData);
                $.ajax(
                    {
                        headers: {
                            "Content-Type":"application/json",
                            "Accept":"application/json"
                        },
                        url: baseURL + 'products/change',
                        type: 'POST',
                        data: JSON.stringify(formData),
                        processData: false,
                        contentType: false,

                        error: function(err) {
                            errorMsg.html(err.responseJSON.error);
                        }
                    }
                ).then((responce) =>{
                        console.log(responce);
                        errorMsg.empty();
                        if(responce.code) errorMsg.html(responce.message);
                        else errorMsg.html("Данные успешно сохранены")
                });

            });



        }

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

    console.log($('#saveChanges').text());



    getAllProduct().then(responce => {
        console.log(responce);
        printMessage(responce)
    });


});