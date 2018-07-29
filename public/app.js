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
                        <a class="btn btn-success save">Save Article</a>
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


//Function that Devours the Burgers and Puts them into the Devoured List
$(document).on('click', '#btnScrape', function(){
    scrapeResults();
});