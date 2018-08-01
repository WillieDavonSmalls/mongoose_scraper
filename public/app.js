 // *************************************************** Build HTML for Scrape NY Times ****************************************** \\
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
// ************************************************ End Build HTML for Scrape NY Times ******************************************* \\

// ***************************************** Build Saved Articles HTML for Scrape NY Times **************************************** \\
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
 // ************************************************* End Build Saved Articles HTML for Scrape NY Times *************************************** \\


 // ************************************************* Build Notes Modal for Article ************************************************************ \\
function buildNotesModal(data,mongo_id){
    var html = `
    <div class="bootbox modal fade show" data-mongoid="${mongo_id}" tabindex="-1" role="dialog" style="display: block;">
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
                                    <li class="list-group-item note">${data.note[i]}<button class="btn btn-danger note-delete">x</button></li>`
                                }
                            } else{
                                html += `
                                <li class="list-group-item">No notes for this article yet.</li>`;
                            }
    
                            html += 
                            `</ul>
                            <textarea placeholder="New Note" id="textareaNotes" rows="4" cols="60"></textarea>
                            <button class="btn btn-success save">Save Note</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>`
    return html
}
// ******************************************************************************************************************************************** \\


 // ****************************************************** POST save articles to MongoDB ***************************************************** \\ 
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
        },
        error: function(e) {
            console.error(e);
        }
    });

    $(this).closest("div.card").remove(); 
});
// *********************************** End POST save articles to MongoDB ********************************* \\ 


 // *********************************** POST to delete articles to MongoDB ********************************* \\ 
 $(document).on('click', 'a.btn.btn-danger.delete', function(){
    var mongo_id = {mongoCollectionId : $(this).closest("div.card").data("mongoid")}; 

    jQuery.ajax({
        type: 'POST',
        url: '/api/delete',
        data: mongo_id,
        dataType: 'json',
        success: function() {
            console.log('sending post request', mongo_id);
        },
        error: function(e) {
            console.error(e);
        }
    });

    $(this).closest("div.card").remove(); 
});
// *********************************** End POST save articles to MongoDB ********************************* \\ 




// ********************** On Click Button Function that opens modal for notes *********************************** \\
$(document).on('click', 'a.btn.btn-info.notes', function(){
    var mongo_id = $(this).closest("div.card").data("mongoid");
    // var test = $(this).closest("div.card").data("mongoid"); 
    // alert(test);
    console.log(mongo_id);
    jQuery.ajax({
        type: 'GET',
        url: '/api/articles/'+ mongo_id,
        success: function(data) {
            console.log('sending post request', mongo_id);
            console.log(data.note); 
            console.log(data.title);
            var html = buildNotesModal(data,mongo_id);
            $("body").append(html);
        },
        error: function(e) {
            console.error(e);
        }
    })
});
// ************************************************************************************************************* \\ 

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



// ********************** On Click Button Function that hides Modal *********************************** \\
$(document).on('click', 'button.bootbox-close-button.close', function(){
    $('.modal').hide();
});
// ************************************************************************************************************* \\


// ************************************************* Extract Notes from Modal on Save *********************************** \\
$(document).on('click', 'button.btn.btn-success.save', function(){
    var newNote = $('#textareaNotes').val();
    var mongo_id = $('div.bootbox.modal.fade.show').data("mongoid");
    
    var notes = [];
    var note;

    var notesObj; 
    
    //Check if there is a new note
    if (newNote !== null && newNote !== ''){
        // alert(newNote);
        // alert(mongo_id);

        //Pull all notes from the lists
        $('ul.list-group.note-container').each(function(){
            $('li').each(function(){
                note = $(this).text();
                note = note.trim(); 
                if(note.endsWith("x")){
                    if (note != 'No notes for this article yet.'){
                        notes.push(note.slice(0,-1));
                    }
                }
            });
        });

        //push the new note to the list with the other notes
        notes.push(newNote)

        //build JSON object to post
        notesObj = {note: notes, mongoid: mongo_id};
        console.log(notesObj);

        jQuery.ajax({
            type: 'POST',
            url: '/api/updatenote',
            data: notesObj,
            dataType: 'json',
            success: function() {
                console.log('sending post request', notesObj);
                notes = [];
            },
            error: function(e) {
                console.error(e);
            }
        });

        //hide the modal and then close it.
        $('.modal').hide();
        $('.modal').remove();
    }
    
});

// ************************************************************************************************************* \\
$(document).on('click', 'button.btn.btn-danger.note-delete', function(){

    var mongo_id = $('div.bootbox.modal.fade.show').data("mongoid");
    $(this).closest('li.list-group-item.note').remove() //li.list-group-item.note
    
    var notes = [];
    var note;

    var notesObj; 

    $('ul.list-group.note-container').each(function(){
        $('li').each(function(){
            note = $(this).text();
            note = note.trim(); 
            if(note.endsWith("x")){
                if (note != 'No notes for this article yet.'){
                    notes.push(note.slice(0,-1));
                }
            }
        });
    });

    notesObj = {note: notes, mongoid: mongo_id};
    console.log(notesObj);

    jQuery.ajax({
        type: 'POST',
        url: '/api/updatenote',
        data: notesObj,
        dataType: 'json',
        success: function() {
            console.log('sending post request', notesObj);
            notes = [];
        },
        error: function(e) {
            console.error(e);
        }
    });

    //hide the modal and then close it. 
    $('.modal').hide();
    $('.modal').remove();

}); 
