//scrape website
    // HTML for Display devoured burgers
    function buildScrapedTable(data) {

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

        return html;
    }

    jQuery.ajax({
        method: 'GET',
        url: '/api/scrape',
        dataType: 'json',
        success: function(data){
            console.log(data);
            // $("#t01").remove();
            // $("#devBurgers").after(buildDevBurgerTable(data));
        },
        error: function(e){
            console.error(e)
        }
    });
