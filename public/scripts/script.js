
let msgList, errorMsg;
let squarespaceModal;
let baseURL;


$(() => {
    baseURL = location.href;
    msgList = $('#msgList');
    errorMsg = $('#errorMsg');
    squarespaceModal = $("#squarespaceModal");

    let printMessage = (data) =>{

        let container = msgList;
        container.empty();
        $('#wrapper').append(container);
        for(let i = 0; i < data.length; i++) {
            let div = $('<div id="mess" class="col">');
            let form = $('<form>');
            form.attr("id", data[i].id);
            form.attr("enctype", "multipart/form-data");

            let name = $(`<input type="text" name="name" id="name${i}">`).val(data[i].name);
            let description = $(`<input type="text" name="description" id="description${i}">`).val(data[i].description);
            let price = $(`<input type="number" name="price" id="price${i}">`).val(data[i].price);
            let button = $(`<button id="saveChanges${i}" type="submit">`).text('Save changes');
            if(data[i].image)
            {
                let image = $('<img height="150">');
                image.attr("src", baseURL + "/uploads/" + data[i].image);

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

                const formData  = {
                    "id": data[i].id,
                    "name": $(`#name${i}`).val(),
                    "description": $(`#description${i}`).val(),
                    "price": $(`#price${i}`).val()
                };

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
                        errorMsg.empty();
                        if(responce.code) errorMsg.html(responce.message);
                        else errorMsg.html("Данные успешно сохранены")
                });

            });
        }
    };

    let sendAjax=(type='GET', data='')=> {

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

        sendAjax("POST", data)
            .then((responce) =>{
                errorMsg.empty();
                getAllProduct().then(responce => {
                    printMessage(responce)
                });
            });
    });



    getAllProduct().then(responce => {
        printMessage(responce)
    });


});