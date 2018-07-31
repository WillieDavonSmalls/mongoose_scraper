//scrape website
    // HTML for Display devoured burgers
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

//On Click Button Function that scrapes 20 articles from NY Times
$(document).on('click', '#btnScrape', function(){
    scrapeResults();
});

//On Click Button Function that scrapes 20 articles from NY Times
$(document).on('click', '#btnClear', function(){
    $("div.allCards").remove();
});


$(document).on('click', '#saveArticle', function(){
    var inputArticle; 

    var link = $('a.article-link').attr('href').trim();
    var title = $(this).closest("h3").text().replace('Save Article','').trim();
    var summary = $("div#articleSummary").text().trim();
    
    inputArticle = {
        article_link: link,
        article_title: title,
        article_summary: summary,
        article_notes: {date:"", comment: ""}
    };

    console.log('here', JSON.stringify(inputArticle));

    jQuery.ajax({
        type: 'POST',
        url: '/api/save',
        data: JSON.stringify(inputArticle),
        dataType: 'json',
        contentType: "application/json; charset=utf-8",
        success: function() {
            console.log('sending post request', inputArticle);
            $(this).closest("div.card").remove(); //works
        },
        error: function(e) {
            console.error(e);
        }
    });

});

function buildSavedArticleCards(){
    function buildSavedCards(data) {
        var html = `<div class="allSavedCards">`;

        data.forEach(function(data) {
            html += `
        <div data-mongoid="${data._id}" class="card">
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
                $("div.allSavedCards").remove();
                $("div.saved-cards").append(buildSavedArticleCards(data));
            },
            error: function(e){
                console.error(e)
            }
        });
};
