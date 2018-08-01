 // ********************** Build HTML for Scrape NY Times ********************** \\
function scrapeResults(){
    function buildScrapedCards(data) {
        var html = `<div class="allCards">`;
        data.forEach(function(data) {
            html += `
            <div class="card">
                <div class="card-header">
                    <h3>
                        <a class="article-link" target="_blank" rel="noopener noreferrer" href="${data.link}">${data.title}</a>
                        <a class="btn btn-success save" id="saveArticle">Save Article</a>
                    </h3>
                </div>
                <div class="card-body" id="articleSummary">${data.summary}</div>
            </div>
            `;
        });

        html += `</div>`
        return html;
    }

    jQuery.ajax({
        method: 'GET',
        url: '/api/scrape',
        dataType: 'json',
        success: function(data){
            console.log(data);
            $("div.allCards").remove();
            $("div.container-fluid").append(buildScrapedCards(data));
        },
        error: function(e){
            console.error(e)
        }
    });    
}
// ********************** End Build HTML for Scrape NY Times ********************** \\

// ********************** Build Saved Articles HTML for Scrape NY Times ********************** \\
function buildSavedArticleCards(){
    function buildSavedCards(data) {
        var html = `<div class="allCards">`;

        data.forEach(function(data) {
            html += `
        <div class="card" data-mongoid="${data._id}">
            <div class="card-header">
                <h3>
                <a class="article-link" target="_blank" rel="noopener noreferrer" href="${data.link}">${data.title}</a>
                <a class="btn btn-danger delete">Delete From Saved</a>
                <a class="btn btn-info notes">Article Notes</a>
                </h3>
            </div>
            <div class="card-body">${data.summary}</div>
            </div>
            `;
        });

        html += `</div>`
        return html;
        }

        jQuery.ajax({
            method: 'GET',
            url: '/api/articles',
            dataType: 'json',
            success: function(data){
                console.log(data);
                $("div.allCards").remove();
                $("div.container-fluid").append(buildSavedCards(data));
            },
            error: function(e){
                console.error(e)
            }
        });
};
 // ********************** End Build Saved Articles HTML for Scrape NY Times ********************** \\


 // *********************************** POST save articles to MongoDB ********************************* \\ 
$(document).on('click', '#saveArticle', function(){
    var inputArticle; 

    var link = $('a.article-link').attr('href').trim();
    var title = $(this).closest("h3").text().replace('Save Article','').trim();
    var summary = $("div#articleSummary").text().trim();
    
    inputArticle = {
        link: link,
        title: title,
        summary: summary,
        note: []
    };

    jQuery.ajax({
        type: 'POST',
        url: '/api/save',
        data: inputArticle,
        dataType: 'json',
        success: function() {
            console.log('sending post request', inputArticle);
            $(this).closest("div.card").remove(); 
        },
        error: function(e) {
            console.error(e);
        }
    });
});
// *********************************** End POST save articles to MongoDB ********************************* \\ 


// ********************** On Click Button Function that scrapes 20 articles from NY Times uses GET ********************** \\
$(document).on('click', '#btnScrape', function(){
    scrapeResults();
});
// ************************************************************************************************************* \\

// ********************** On Click Button Function that removes all cards fromt the UI ********************** \\
$(document).on('click', '#btnClear', function(){
    $("div.allCards").remove();
});
// ************************************************************************************************************* \\

// ********************** On Click Button Function that builds saved articles from uses GET********************** \\
$(document).on('click', '#btnSavedArticles', function(){
    buildSavedArticleCards();
});
// ************************************************************************************************************* \\

// ********************** On Click Button Function that opens modal for notes *********************************** \\
$(document).on('click', 'a.btn.btn-info.notes', function(){
    alert('hello');
    testHTML();
});
// ************************************************************************************************************* \\ 




function testHTML(){
    var data = {
        "note": [
        "hello",
        "hello2",
        "hello3"
        ],
        "_id": "5b60d9327ea55041f0fad9a3",
        "link": "test",
        "title": "test",
        "summary": "test",
        "__v": 0
        }
    
    var html = `
    <div class="bootbox modal fade show" data-mongoid="${data._id}" tabindex="-1" role="dialog" style="display: block;">
        <div class="modal-dialog">
            <div class="modal-content">
                <div class="modal-body">
                    <button type="button" class="bootbox-close-button close" data-dismiss="modal" aria-hidden="true" style="margin-top: -10px;">×</button>
                    <div class="bootbox-body">
                        <div class="container-fluid text-center">
    
                            <h4>Notes For Article: ${data.title}</h4>
                            <hr>
                            <ul class="list-group note-container">`;
    
                            if(data.note.length > 0){
                                for(var i = 0; i < data.note.length; i++){
                                    html += `
                                    <li class="list-group-item">${data.note[i]}.</li>`
                                }
                            } else{
                                html += `
                                <li class="list-group-item">No notes for this article yet.</li>`;
                            }
    
                            html += 
                            `</ul>
                            <textarea placeholder="New Note" rows="4" cols="60"></textarea>
                            <button class="btn btn-success save">Save Note</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
    return html
    console.log(html);
}

