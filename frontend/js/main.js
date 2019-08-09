//Opening adding document page
function openAddDoc() {
    var overlay = document.getElementsByClassName('overlay')[0];
    overlay.style.display = 'block';
    var addDocument = document.getElementById('addDocument');
    addDocument.style.display = 'block';
}

//Closing adding document page
function closeAddDoc() {
    var overlay = document.getElementsByClassName('overlay')[0];
    overlay.style.display = 'none';
    var addDocument = document.getElementById('addDocument');
    addDocument.style.display = 'none';
}

function checkIfDocExists() {
    var exists = false;
    var names = document.getElementById('documents').getElementsByTagName('h2');
    for (var i=0; i < names.length; i++) {
        if (document.getElementById('docTitle').value == names[i].innerHTML) {
            exists = true;
            break;
        }
    }

    return exists;
}

//Adding document to body
function addDoc() {
    if (document.getElementById('docTitle').value != '' && !checkIfDocExists()) {
        closeAddDoc();

        //Adds new document
        var documents = document.getElementById('documents');
        var a = document.createElement('A');
        a.setAttribute('class', 'document');
        a.setAttribute('sources', " ");

        var title = document.getElementById('docTitle').value;
        var h2 = document.createElement('H2');
        var h2Text = document.createTextNode(title);
        h2.appendChild(h2Text);

        var date = new Date();
        var months = ['January', 'Februrary', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
        var month = months[date.getMonth()];
        var day = date.getDate();
        var year = date.getFullYear();

        var pText = document.createTextNode("Date Created: " + month + " " + day + ", " + year);
        var p = document.createElement('P');
        p.appendChild(pText);

        a.appendChild(h2);
        a.appendChild(p);
        documents.appendChild(a);

        //Emptying text boxes
        document.getElementById('docTitle').value = '';


    } else if (document.getElementById('docTitle').value == '') {
        alert('Must include title');
    } else {
        alert('Document already exists. Choose another one.');
    }
}

function openDoc() {
    document.getElementById('home').style.display = 'none';
    document.getElementById('doc').style.display = 'block';

    $('#docEditing h1:first').html($(this).children('h2').text());
    $('#doc').attr('docId', $(this).attr('docId'));

    var sources = $(this).attr('sources').split(' ;+ ');

    $('#sources').html('');
    for (var i=0; i<sources.length; i++) {
        if (sources[i] != '') {
            if (sources[i].includes('##') && sources[i].includes('%%')) {
                var firstSign = sources[i].split('##');
                var lastSign = firstSign[1].split('%%');
                var part1 = firstSign[0];
                var italics = lastSign[0];
                var part2 = lastSign[1];
                $('#sources').append('<li>' + part1 + '<i>' + italics + '</i>' + part2 + '</li>');
            } else {
                $('#sources').append('<li>' + sources[i] + '</li>');
            }
        }
    }
}

function editSources() {
    //Deleting static text
    var sourcing = document.getElementById('sources');
    var sources = sourcing.getElementsByTagName('li');
    var docEditing = document.getElementById('docEditing');
    docEditing.removeChild(sourcing);

    //Converting sources into textarea
    var textarea = document.createElement('TEXTAREA');
    textarea.setAttribute('rows', 8);
    textarea.setAttribute('cols', 250);
    textarea.setAttribute('id', 'sourceText')

    var text = []
    for (var i=0; i < sources.length; i++) {
        var source = sources[i].innerHTML;
        if (source.includes('<i>')) {
            source = source.replace('<i>', '##');
            source = source.replace('</i>', '%%');
        }
        text.push(source);
    }

    text = text.join('\n');
    text = document.createTextNode(text);
    textarea.appendChild(text);

    var center = document.createElement('CENTER');
    center.appendChild(textarea);
    docEditing.appendChild(center);

    //Deleting edit button and adding save button
    var button = document.getElementById('editSources');
    docEditing.removeChild(button);

    var newButton = document.createElement('BUTTON');
    var h1 = document.createElement('H1');

    newButton.setAttribute('id', 'save');
    newButton.setAttribute('onclick', 'saveSources()');

    var saveText = document.createTextNode('Save');
    h1.appendChild(saveText);
    newButton.appendChild(h1);
    docEditing.appendChild(newButton);

    var p = document.createElement('P');
    var note = document.createTextNode('*The text between the ## and %% symbols will be converted into italics.')
    p.appendChild(note);
    docEditing.appendChild(p);
}

//Converting back to static text
function saveSources() {
    var sourceArray = returnSources();
    var ul = document.createElement('UL');
    ul.setAttribute('id', 'sources');

    for (var i=0; i < sourceArray.length; i++) {
        if (sourceArray[i] != '') {
            if (sourceArray[i].includes('##') && sourceArray[i].includes('%%')) {
                var firstSign = sourceArray[i].indexOf('#');
                var lastSign = sourceArray[i].indexOf('%');
                var part1 = document.createTextNode(sourceArray[i].substring(0, firstSign));
                var italics = document.createTextNode(sourceArray[i].substring(firstSign+2, lastSign));
                var part2 = document.createTextNode(sourceArray[i].substring(lastSign+2));

                var li = document.createElement('LI');
                var i = document.createElement('I');

                i.appendChild(italics);
                li.appendChild(part1);
                li.appendChild(i);
                li.appendChild(part2);
                ul.appendChild(li);
            } else {
                var li = document.createElement('LI');
                var source = document.createTextNode(sourceArray[i]);
                li.appendChild(source);
                ul.appendChild(li);
            }
            
        }
    }

    //Deleting textarea, save button, and text at the bottom
    var docEditing = document.getElementById('docEditing');
    var center = docEditing.getElementsByTagName('center');
    docEditing.removeChild(center[0]);

    var save = document.getElementById('save');
    docEditing.removeChild(save);

    var p = docEditing.getElementsByTagName('p')[0];
    docEditing.removeChild(p);

    //Adding in changed sources and edit button
    var button = document.createElement('BUTTON');
    var h1 = document.createElement('H1');

    var pencil = document.createTextNode('\u270E');
    h1.appendChild(pencil);
    button.appendChild(h1);

    button.setAttribute('id', 'editSources');
    button.setAttribute('onclick', 'editSources()');

    docEditing.appendChild(ul);
    docEditing.appendChild(button);
}

function returnSources() {
    var $array = $('#sourceText').val.split('\n');
    return $array;
}

function openEditSourceSettings() {
    document.getElementsByClassName('overlay')[1].style.display = 'block';
    document.getElementById('addSource').style.display = 'none';
    document.getElementById('editSourceSettings').style.display = 'block';
}

function closeEditSourceSettings() {
    document.getElementsByClassName('overlay')[1].style.display = 'none';
}

function openAddSource() {
    if (document.getElementById('format').innerHTML != 'Format' && document.getElementById('type').innerHTML != 'Type of Source' && document.getElementById('note').innerHTML != 'Footnote or Bibliographical Entry') {
        document.getElementById('editSourceSettings').style.display = 'none';
        document.getElementById('addSource').style.display = 'block';

        if (document.getElementById('format').innerHTML == 'MLA') {
            if (document.getElementById('type').innerHTML != 'Webpage') {
                document.getElementById('URL').style.display = 'none';
                document.getElementById('webTitle').style.display = 'none';
                document.getElementById('dateAccessed').style.display = 'none';
                document.getElementById('datePublished').getElementsByTagName('input')[0].style.display = 'none'; //Month
                document.getElementById('datePublished').getElementsByTagName('input')[1].style.display = 'none'; //Day
                document.getElementById('articleTitle').setAttribute('placeholder', 'Book Title');
                document.getElementById('publisher').style.display = 'inline';
            } else {
                document.getElementById('URL').style.display = 'inline';
                document.getElementById('webTitle').style.display = 'inline';
                document.getElementById('webTitle').setAttribute('placeholder', 'Website Title');
                document.getElementById('dateAccessed').style.display = 'inline';
                document.getElementById('datePublished').getElementsByTagName('input')[0].style.display = 'inline';
                document.getElementById('datePublished').getElementsByTagName('input')[1].style.display = 'inline';
                document.getElementById('articleTitle').setAttribute('placeholder', 'Article Title');
                document.getElementById('publisher').style.display = 'inline';
            }
        } else if (document.getElementById('format').innerHTML == 'APA') {
            if (document.getElementById('type').innerHTML != 'Webpage') {
                document.getElementById('URL').style.display = 'none';
                document.getElementById('dateAccessed').style.display = 'none';
                document.getElementById('datePublished').getElementsByTagName('input')[0].style.display = 'none';
                document.getElementById('datePublished').getElementsByTagName('input')[1].style.display = 'none';
                document.getElementById('articleTitle').setAttribute('placeholder', 'Book Title');
                document.getElementById('webTitle').style.display = 'inline';
                document.getElementById('webTitle').setAttribute('placeholder', 'Location') //Resetting webTitle to location
                document.getElementById('publisher').style.display = 'inline';
            } else {
                document.getElementById('URL').style.display = 'inline';
                document.getElementById('webTitle').style.display = 'none';
                document.getElementById('dateAccessed').style.display = 'inline';
                document.getElementById('datePublished').getElementsByTagName('input')[0].style.display = 'none';
                document.getElementById('datePublished').getElementsByTagName('input')[1].style.display = 'none';
                document.getElementById('articleTitle').setAttribute('placeholder', 'Article Title');
                document.getElementById('publisher').style.display = 'none';
            }
        } else {
            if (document.getElementById('type').innerHTML != 'Webpage') {
                document.getElementById('URL').style.display = 'none';
                document.getElementById('dateAccessed').style.display = 'none';
                document.getElementById('datePublished').getElementsByTagName('input')[0].style.display = 'none'; //Month
                document.getElementById('datePublished').getElementsByTagName('input')[1].style.display = 'none'; //Day
                document.getElementById('articleTitle').setAttribute('placeholder', 'Book Title');
                document.getElementById('webTitle').style.display = 'inline';
                document.getElementById('webTitle').setAttribute('placeholder', 'Location') //Resetting webTitle to location
                document.getElementById('publisher').style.display = 'inline';
            } else {
                document.getElementById('URL').style.display = 'inline';
                document.getElementById('webTitle').style.display = 'inline';
                document.getElementById('webTitle').setAttribute('placeholder', 'Website Title');
                document.getElementById('dateAccessed').style.display = 'inline';
                document.getElementById('datePublished').getElementsByTagName('input')[0].style.display = 'inline';
                document.getElementById('datePublished').getElementsByTagName('input')[1].style.display = 'inline';
                document.getElementById('articleTitle').setAttribute('placeholder', 'Article Title');
                document.getElementById('publisher').style.display = 'inline';
            }
        }
        
    } else {
        alert('Must choose settings for source');
    }
}

function closeAddSource() {
    document.getElementsByClassName('overlay')[1].style.display = 'none';

    //Emptying input bars
    var inputs = document.getElementById('addSource').getElementsByTagName('input');
    for (var i=0; i < inputs.length; i++) {
        inputs[i].value = '';
    }

    var rows = document.getElementById('authors').getElementsByClassName('row');
    var br = document.getElementById('authors').getElementsByTagName('br');

    for (var j=0; j < rows.length;) {
        document.getElementById('authors').removeChild(rows[j]);
    }

    for (var k=0; k < br.length;) {
        document.getElementById('authors').removeChild(br[k]);
    }
}

function addAuthor() {
    var authors = document.getElementById('authors');

    var row = document.createElement('DIV');
    row.setAttribute('class', 'row');

    //Creating inputs
    var firstName = document.createElement('INPUT');
    firstName.setAttribute('placeholder', 'First Name');
    firstName.setAttribute('class', 'firstName');

    var middleName = document.createElement('INPUT');
    middleName.setAttribute('placeholder', 'Middle Name');
    middleName.setAttribute('class', 'middleName');

    var lastName = document.createElement('INPUT');
    lastName.setAttribute('placeholder', 'Last Name');
    lastName.setAttribute('class', 'lastName');

    var deleteBtn = document.createElement('BUTTON');
    deleteBtn.setAttribute('class', 'deleteBtn');
    var x = document.createTextNode('x');
    deleteBtn.appendChild(x);

    var br = document.createElement('BR');

    authors.appendChild(br);
    row.appendChild(firstName);
    row.appendChild(middleName);
    row.appendChild(lastName);
    row.append(deleteBtn);
    authors.appendChild(row);
}

function addSource() {
    var author = '';
    var page = '';
    var website = '';
    var datePublished = '';
    var dateAccessed = '';
    var url = '';

    //MLA
    if (document.getElementById('format').innerHTML == 'MLA') {
        var firstNames = document.getElementsByClassName('firstName');
        var middleNames = document.getElementsByClassName('middleName');
        var lastNames = document.getElementsByClassName('lastName');
        
        //Author Name(s)
        if (firstNames[0].value != '' && lastNames[0].value != '') {
            if (firstNames.length == 1) {
                if (middleNames[0].value != '') {
                    if (middleNames[0].value.substring(1, 2) == '.') {
                        author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + ' ';
                    } else {
                        author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + '. ';
                    }
                    
                } else {
                    author = author + lastNames[0].value + ', ' + firstNames[0].value + '. ';
                }

            } else if (firstNames.length == 2) {
                if (middleNames[0].value != '' && middleNames[1].value != '') {
                    if (middleNames[0].value.length > 1) {
                        if (middleNames[1].value.length > 1) {
                            author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + ' and ' + firstNames[1].value + ' ' + middleNames[1].value + ' ' + lastNames[1].value + '. ';
                        } else {
                            author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + ' and ' + firstNames[1].value + ' ' + middleNames[1].value + '. ' + lastNames[1].value + '. ';
                        }
                    } else {
                        if (middleNames[1].value.length > 1) {
                            author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + '. and ' + firstNames[1].value + ' ' + middleNames[1].value + ' ' + lastNames[1].value + '. ';
                        } else {
                            author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + '. and ' + firstNames[1].value + ' ' + middleNames[1].value + '. ' + lastNames[1].value + '. ';
                        }
                    }

                } else if (middleNames[0].value == '' && middleNames[1].value != '') {
                    if (middleNames[1].value.length > 1) {
                        author = author + lastNames[0].value + ', ' + firstNames[0].value + ' and ' + firstNames[1].value + ' ' + middleNames[1].value + ' ' + lastNames[1].value + '. ';
                    } else {
                        author = author + lastNames[0].value + ', ' + firstNames[0].value + ' and ' + firstNames[1].value + ' ' + middleNames[1].value + '. ' + lastNames[1].value + '. ';
                    }

                } else if (middleNames[0].value != '' && middleNames[1].value == '') {
                    if (middleNames[0].value.length > 1) {
                        author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + ' and ' + firstNames[1].value + ' ' + lastNames[1].value + '. ';
                    } else {
                        author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + '. and ' + firstNames[1].value + ' ' + lastNames[1].value + '. ';
                    }

                } else {
                    author = author + lastNames[0].value + ', ' + firstNames[0].value + ' and ' + firstNames[1].value + ' ' + lastNames[1].value + '. ';
                }

            } else {
                if (middleNames[0].value != '') {
                    if (middleNames[0].value.length > 1) {
                        author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + ', ' + 'et al. ';
                    } else {
                        author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + ', ' + 'et al. ';
                    }
                } else {
                    author = author + lastNames[0].value + ', ' + firstNames[0].value + ', ' + 'et al. ';
                }
            }
        }

        //Title
        var articleTitle = document.getElementById('articleTitle').value;
        if (document.getElementById('type').innerHTML == 'Webpage') {
            if (articleTitle.substring(articleTitle.length - 1) != '.' && articleTitle.substring(articleTitle.length - 1) != '?' && articleTitle.substring(articleTitle.length - 1) != '!') {
                page = page + '"' + articleTitle + '.' + '" ';
            } else {
                page = page + '"' + articleTitle + '" ';
            }

        } else {
            if (articleTitle.substring(articleTitle.length - 1) != '.' && articleTitle.substring(articleTitle.length - 1) != '?' && articleTitle.substring(articleTitle.length - 1) != '!') {
                page = page + articleTitle + '. ';
            } else {
                page = page + articleTitle + ' ';
            }
        }

        //Website/Book Information
        if (document.getElementById('type').innerHTML == 'Webpage') {
            if (document.getElementById('publisher').value != '') {
                website = website + document.getElementById('webTitle').value + ', ' + document.getElementById('publisher').value + ', ';
            } else {
                website = website + document.getElementById('webTitle').value + ', ';
            }
        } else {
            if (document.getElementById('publisher').value != '') {
                website = website + document.getElementById('publisher').value + ', ';
            }
        }
        
        //Date Published
        var dateP = document.getElementById('datePublished').getElementsByTagName('input');
        if (document.getElementById('type').innerHTML == 'Webpage') {
            if (dateP[0].value != '' && dateP[1].value != '' && dateP[2].value != '') {
                if (dateP[0].value.length > 3) {
                    datePublished = datePublished + dateP[1].value + ' ' + dateP[0].value.substring(0, 3) + '. ' + dateP[2].value + ', ';
                } else {
                    datePublished = datePublished + dateP[1].value + ' ' + dateP[0].value + ' ' + dateP[2].value + ', ';
                }
            }
        } else {
            if (dateP[2].value != '') {
                datePublished = datePublished + dateP[2].value + '.';
            }
        }
        
        //URL
        if (document.getElementById('URL').value.substring(0, 8) == 'https://') {
            url = url + document.getElementById('URL').value.substring(8) + '. ';
        } else {
            url = url + document.getElementById('URL').value + '. ';
        }
        
        //Date Accessed
        var dateA = document.getElementById('dateAccessed').getElementsByTagName('input');
        if (dateA[0].value != '' && dateA[1].value != '' && dateA[2].value != '') {
            if (dateA[0].value.length > 3) {
                dateAccessed = dateAccessed + 'Accessed ' + dateA[1].value + ' ' + dateA[0].value.substring(0, 3) + '. ' + dateA[2].value + '.';
            } else {
                dateAccessed = dateAccessed + 'Accessed ' + dateA[1].value + ' ' + dateA[0].value + ' ' + dateA[2].value + '.';
            }
        }

        if (document.getElementById('type').innerHTML == 'Webpage') {
            if (articleTitle != '' && document.getElementById('URL').value != '' && document.getElementById('webTitle').value != '' && ((dateP[0].value != '' && dateP[1].value != '' && dateP[2].value != '') || (dateA[0].value != '' && dateA[1].value != '' && dateA[2].value != ''))) {
                var source = author + page + website + datePublished + url + dateAccessed;
                
                var node = document.createTextNode(source);
                var sources = document.getElementById('sources');
                var li = document.createElement('LI');
                li.appendChild(node);
                sources.appendChild(li);

                closeAddSource();
            } else {
                alert('Missing important parameters');
            }
        } else {
            if (articleTitle != '' && dateP[2].value != '') {
                var source1 = author;

                if (dateP[2].value == '') {
                    var source2 = website + dateAccessed;
                } else {
                    var source2 = website + datePublished;
                }              

                var node1 = document.createTextNode(source1);
                var node2 = document.createTextNode(source2);

                var i = document.createElement('I');
                var node3 = document.createTextNode(page);
                i.appendChild(node3);

                var sources = document.getElementById('sources');
                var li = document.createElement('LI');
                li.appendChild(node1);
                li.appendChild(i);
                li.appendChild(node2);
                sources.appendChild(li);

                closeAddSource();
            } else {
                alert('Missing important parameters');
            }
        }
    
    //APA
    } else if (document.getElementById('format').innerHTML == 'APA') {
        var firstNames = document.getElementsByClassName('firstName');
        var middleNames = document.getElementsByClassName('middleName');
        var lastNames = document.getElementsByClassName('lastName');

        //Author Name(s)
        if (firstNames[0].value != '' && lastNames[0].value != '') {
            if (firstNames.length == 1) {
                if (middleNames[0].value != '') {
                    author = author + lastNames[0].value + ', ' + firstNames[0].value.substring(0, 1) + '. ' + middleNames[0].value.substring(0, 1) + '. ';
                } else {
                    author = author + lastNames[0].value + ', ' + firstNames[0].value.substring(0, 1) + '. ';
                }
            } else if (firstNames.length < 7) {
                for (var i = 0; i < firstNames.length; i++) {
                    if (i < firstNames.length - 1) {
                        if (middleNames[i].value != '') {
                            author = author + lastNames[i].value + ', ' + firstNames[i].value.substring(0, 1) + '. ' + middleNames[i].value.substring(0, 1) + '., ';
                        } else {
                            author = author + lastNames[i].value + ', ' + firstNames[i].value.substring(0, 1) + '., ';
                        }

                    } else {
                        if (middleNames[i].value != '') {
                            author = author + '& ' + lastNames[i].value + ', ' + firstNames[i].value.substring(0, 1) + '. ' + middleNames[i].value.substring(0, 1) + '. ';
                        } else {
                            author = author + '& ' + lastNames[i].value + ', ' + firstNames[i].value.substring(0, 1) + '. ';
                        }
                    }
                }
            } else {
                for (var i = 0; i < firstNames.length; i++) {
                    if (i < 6) {
                        if (middleNames[i].value != '') {
                            author = author + lastNames[i].value + ', ' + firstNames[i].value.substring(0, 1) + '. ' + middleNames[i].value.substring(0, 1) + '., ';
                        } else {
                            author = author + lastNames[i].value + ', ' + firstNames[i].value.substring(0, 1) + '., ';
                        }
                    } else if (i == firstNames.length-1) {
                        if (middleNames[i].value != '') {
                            author = author + '. . . ' + lastNames[i].value + ', ' + firstNames[i].value.substring(0, 1) + '. ' + middleNames[i].value.substring(0, 1) + '. ';
                        } else {
                            author = author + '. . . ' + lastNames[i].value + ', ' + firstNames[i].value.substring(0, 1) + '. ';
                        }
                    } 
                }
            }
        }

        //Date Published
        var dateP = document.getElementById('datePublished').getElementsByTagName('input');
        if (dateP[2].value != '') {
            datePublished = datePublished + '(' + dateP[2].value + '). ';
        } else {
            datePublished = datePublished + '(n.d.). ';
        }
        
        //Title
        var articleTitle = document.getElementById('articleTitle').value;
        if (articleTitle.substring(articleTitle.length - 1) != '.' && articleTitle.substring(articleTitle.length - 1) != '?' && articleTitle.substring(articleTitle.length - 1) != '!') {
            page = page + articleTitle + '. ';
        } else {
            page = page + articleTitle + ' ';
        }
        
        //Book Information
        if (document.getElementById('publisher').value != '' && document.getElementById('webTitle').value != '') {
            website = website + document.getElementById('webTitle').value + ': ' + document.getElementById('publisher').value + '.';
        }

        //Date Accessed
        var dateA = document.getElementById('dateAccessed').getElementsByTagName('input');
        if (dateA[0].value != '' && dateA[1].value != '' && dateA[2].value != '') {
            dateAccessed = dateAccessed + 'Retrieved ' + dateA[0].value + ' ' + dateA[1].value + ', ' + dateA[2].value + ', ';
        } else {
            dateAccessed = dateAccessed + 'Retrieved ';
        }

        //URL
        url = url + 'from ' + document.getElementById('URL').value;

        if (document.getElementById('type').innerHTML == 'Webpage') {
            if (articleTitle != '' && document.getElementById('URL').value != '' && (dateP[2].value != '' || (dateA[0].value != '' && dateA[1].value != '' && dateA[2].value != ''))) {
                if (author.value == '') {
                    var source = page + datePublished + dateAccessed + url;
                } else {
                    var source = author + datePublished + page + dateAccessed + url;
                }

                var node = document.createTextNode(source);
                var sources = document.getElementById('sources');
                var li = document.createElement('LI');
                li.appendChild(node);
                sources.appendChild(li);

                closeAddSource();
            } else {
                alert('Missing important parameters');
            }
        } else {
            if (articleTitle != '' && dateP[2].value != '') {
                var source1 = author + datePublished;
                var source2 = website;

                var node1 = document.createTextNode(source1);
                var node2 = document.createTextNode(source2);

                var i = document.createElement('I');
                var node3 = document.createTextNode(page);
                i.appendChild(node3);

                var sources = document.getElementById('sources');
                var li = document.createElement('LI');
                li.appendChild(node1);
                li.appendChild(i);
                li.appendChild(node2);
                sources.appendChild(li);

                closeAddSource();
            } else {
                alert('Missing important parameters');
            }
        }

    //Chicago
    } else if (document.getElementById('format').innerHTML == 'Chicago 17th') {
        if (document.getElementById('note').innerHTML == 'Footnote') {
            var useCommas = true;
        } else {
            var useCommas = false;
        }

        var firstNames = document.getElementsByClassName('firstName');
        var middleNames = document.getElementsByClassName('middleName');
        var lastNames = document.getElementsByClassName('lastName');

        //Author Name(s)
        if (firstNames[0].value != '' && lastNames[0].value != '') {
            if (firstNames.length == 1) {
                if (middleNames[0].value != '') {
                    if (middleNames[0].value.substring(1, 2) == '.') {
                        if (useCommas) {
                            author = author + firstNames[0].value + ' ' + middleNames[0].value + ' ' + lastNames[0].value + ', ';
                        } else {
                            author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + ' ';
                        }
                    } else {
                        if (useCommas) {
                            author = author + firstNames[0].value + ' ' + middleNames[0].value + ' ' + lastNames[0].value + ', ';
                        } else {
                            author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + '. ';
                        }
                    }
                } else {
                    if (useCommas) {
                        author = author + firstNames[0].value + ' ' + lastNames[0].value + ', ';
                    } else {
                        author = author + lastNames[0].value + ', ' + firstNames[0].value + '. ';
                    }
                    
                }

            } else if (2 <= firstNames.length <= 3) {
                for (var i=0; i < firstNames.length; i++) {
                    if (i = 0) {
                        if (firstNames.length == 2) {
                            if (middleNames[i].value != '') {
                                if (middleNames[i].value.substring(1, 2) == '.' || middleNames[i].length > 1) {
                                    if (useCommas) {
                                        author = author + firstNames[i].value + ' ' + middleNames[i].value + ' ' + lastNames[i].value + ' and ';
                                    } else {
                                        author = author + lastNames[i].value + ', ' + firstNames[i].value + ' ' + middleNames[i].value + ' and ';
                                    }
                                } else {
                                    if (useCommas) {
                                        author = author + firstNames[i].value + ' ' + middleNames[i].value + ' ' + lastNames[i].value + '. and ';
                                    } else {
                                        author = author + lastNames[i].value + ', ' + firstNames[i].value + ' ' + middleNames[i].value + '. and ';
                                    }  
                                }
                            } else {
                                if (useCommas) {
                                    author = author + ', ' + firstNames[i].value + ' ' + lastNames[i].value + ' and ';
                                } else {
                                    author = author + lastNames[i].value + ', ' + firstNames[i].value + ' and ';
                                }
                            }

                        } else {
                            if (middleNames[i].value != '') {
                                if (middleNames[i].length > 1) {
                                    if (useCommas) {
                                        author = author + firstNames[i].value + ' ' + middleNames[i].value + ' ' + lastNames[i].value + ', ';
                                    } else {
                                        author = author + lastNames[i].value + ', ' + firstNames[i].value + ' ' + middleNames[i].value + ', ';
                                    }
                                } else {
                                    if (useCommas) {
                                        author = author + firstNames[i].value + ' ' + middleNames[i].value + ' ' + lastNames[i].value + '., ';
                                    } else {
                                        author = author + lastNames[i].value + ', ' + firstNames[i].value + ' ' + middleNames[i].value + '., ';
                                    }
                                }
                            } else {
                                if (useCommas) {
                                    author = author + firstNames[i].value + ' ' + lastNames[i].value + ', ';
                                } else {
                                    author = author + lastNames[i].value + ', ' + firstNames[i].value + ', ';
                                }
                            }
                        }

                    } else {
                        if (firstNames.length == 2 || (firstNames.length == 3 && i == 2)) {
                            if (middleNames[i].value != '') {
                                if (middleNames[i].length > 1) {
                                    if (useCommas) {
                                        author = author + firstNames[i].value + ' ' + middleNames[i].value + ' ' + lastNames[i].value + ', ';
                                    } else {
                                        author = author + firstNames[i].value + ' ' + middleNames[i].value + ' ' + lastNames[i].value + '. ';
                                    }
                                } else {
                                    if (useCommas) {
                                        author = author + firstNames[i].value + ' ' + middleNames[i].value + '. ' + lastNames[i].value + ', ';
                                    } else {
                                        author = author + firstNames[i].value + ' ' + middleNames[i].value + '. ' + lastNames[i].value + '. ';
                                    }
                                }
                            } else {
                                if (useCommas) {
                                    author = author + firstNames[i].value + ' ' + lastNames[i].value + ', ';
                                } else {
                                    author = author + firstNames[i].value + ' ' + lastNames[i].value + '. ';
                                }
                            }
                        } else {
                            if (middleNames[i].value != '') {
                                if (middleNames[i].length > 1) {
                                    author = author + firstNames[i].value + ' ' + middleNames[i].value + ' ' + lastNames[i].value + ', and ';
                                } else {
                                    author = author + firstNames[i].value + ' ' + middleNames[i].value + '. ' + lastNames[i].value + ', and ';
                                }
                            } else {
                                author = author + firstNames[i].value + ' ' + lastNames[i].value + ', and ';
                            }
                        }
                    }
                }

            } else {
                if (middleNames[0].value != '') {
                    if (useCommas) {
                        author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + ', ' + 'et al., ';
                    } else {
                        author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + ', ' + 'et al. ';
                    }
                } else {
                    if (useCommas) {
                        author = author + lastNames[0].value + ', ' + firstNames[0].value + ', ' + 'et al., ';
                    } else {
                        author = author + lastNames[0].value + ', ' + firstNames[0].value + ', ' + 'et al. ';
                    }
                }
            }
        }

        //Title
        var articleTitle = document.getElementById('articleTitle').value;
        if (document.getElementById('type').innerHTML == 'Webpage') {
            if (articleTitle.substring(articleTitle.length - 1) != '.' && articleTitle.substring(articleTitle.length - 1) != '?' && articleTitle.substring(articleTitle.length - 1) != '!') {
                if (useCommas) {
                    page = page + '"' + articleTitle + ',' + '" ';
                } else {
                    page = page + '"' + articleTitle + '.' + '" ';
                }
            } else {
                if (useCommas) {
                    page = page + '"' + articleTitle + ',' + '" ';
                } else {
                    page = page + '"' + articleTitle + '" ';
                }
            }

        } else {
            if (articleTitle.substring(articleTitle.length - 1) != '.' && articleTitle.substring(articleTitle.length - 1) != '?' && articleTitle.substring(articleTitle.length - 1) != '!') {
                if (useCommas) {
                    page = page + articleTitle + ' ';
                } else {
                    page = page + articleTitle + '. ';
                }
            } else {
                if (useCommas) {
                    page = page + articleTitle + ' ';
                } else {
                    page = page + articleTitle + ' ';
                }
            }
        }

        //Website/Book Information
        if (document.getElementById('type').innerHTML == 'Webpage') {
            if (document.getElementById('publisher').value != '') {
                if (useCommas) {
                    website = website + document.getElementById('webTitle').value + ', ' + document.getElementById('publisher').value + ', ';
                } else {
                    website = website + document.getElementById('webTitle').value + ', ' + document.getElementById('publisher').value + '. ';
                }
            } else {
                if (useCommas) {
                    website = website + document.getElementById('webTitle').value + ', ';
                } else {
                    website = website + document.getElementById('webTitle').value + '. ';
                }   
            }
        } else {
            if (document.getElementById('publisher').value != '' && document.getElementById('webTitle').value != '') {
                website = website + document.getElementById('webTitle').value + ': ' + document.getElementById('publisher').value + ', ';
            }
        }

        //Date Published
        var dateP = document.getElementById('datePublished').getElementsByTagName('input');
        if (document.getElementById('type').innerHTML == 'Webpage') {
            if (dateP[0].value != '' && dateP[1].value != '' && dateP[2].value != '') {
                if (useCommas) {
                    datePublished = datePublished + 'last modified ' + dateP[0].value + ' ' + dateP[1].value + ', ' + dateP[2].value + ', ';
                } else {
                    datePublished = datePublished + 'Last modified ' + dateP[0].value + ' ' + dateP[1].value + ', ' + dateP[2].value + '. ';
                }
            }
        } else {
            if (dateP[2].value != '') {
                datePublished = datePublished + dateP[2].value;
            }
        }

        //URL
        url = url + document.getElementById('URL').value + '. ';

        //Date Accessed
        var dateA = document.getElementById('dateAccessed').getElementsByTagName('input');
        if (dateA[0].value != '' && dateA[1].value != '' && dateA[2].value != '') {
            if (useCommas) {
                dateAccessed = dateAccessed + 'accessed ' + dateA[0].value + ' ' + dateA[1].value + ' ' + dateA[2].value + ', ';
            } else {
                dateAccessed = dateAccessed + 'Accessed ' + dateA[0].value + ' ' + dateA[1].value + ' ' + dateA[2].value + '. ';
            }
        }

        if (document.getElementById('type').innerHTML == 'Webpage') {
            if (articleTitle != '' && document.getElementById('URL').value != '' && document.getElementById('webTitle').value != '' && ((dateP[0].value != '' && dateP[1].value != '' && dateP[2].value != '') || (dateA[0].value != '' && dateA[1].value != '' && dateA[2].value != ''))) {
                var source = author + page + website + datePublished + dateAccessed + url;

                var node = document.createTextNode(source);
                var sources = document.getElementById('sources');
                var li = document.createElement('LI');
                li.appendChild(node);
                sources.appendChild(li);

                closeAddSource();
            } else {
                alert('Missing important parameters');
            }
        } else {
            if (articleTitle != '' && dateP[2].value != '') {
                var source1 = author;

                if (useCommas) {
                    var source2 = '(' + website + datePublished + ').';
                } else {
                    var source2 = website + datePublished + '.';
                }

                var node1 = document.createTextNode(source1);
                var node2 = document.createTextNode(source2);

                var i = document.createElement('I');
                var node3 = document.createTextNode(page);
                i.appendChild(node3);

                var sources = document.getElementById('sources');
                var li = document.createElement('LI');
                li.appendChild(node1);
                li.appendChild(i);
                li.appendChild(node2);
                sources.appendChild(li);

                closeAddSource();
            } else {
                alert('Missing important parameters');
            }
        }
    }
}

function returnSource() {
    var author = '';
    var page = '';
    var website = '';
    var datePublished = '';
    var dateAccessed = '';
    var url = '';

    //MLA
    if (document.getElementById('format').innerHTML == 'MLA') {
        var firstNames = document.getElementsByClassName('firstName');
        var middleNames = document.getElementsByClassName('middleName');
        var lastNames = document.getElementsByClassName('lastName');

        //Author Name(s)
        if (firstNames[0].value != '' && lastNames[0].value != '') {
            if (firstNames.length == 1) {
                if (middleNames[0].value != '') {
                    if (middleNames[0].value.substring(1, 2) == '.') {
                        author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + ' ';
                    } else {
                        author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + '. ';
                    }

                } else {
                    author = author + lastNames[0].value + ', ' + firstNames[0].value + '. ';
                }

            } else if (firstNames.length == 2) {
                if (middleNames[0].value != '' && middleNames[1].value != '') {
                    if (middleNames[0].value.length > 1) {
                        if (middleNames[1].value.length > 1) {
                            author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + ' and ' + firstNames[1].value + ' ' + middleNames[1].value + ' ' + lastNames[1].value + '. ';
                        } else {
                            author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + ' and ' + firstNames[1].value + ' ' + middleNames[1].value + '. ' + lastNames[1].value + '. ';
                        }
                    } else {
                        if (middleNames[1].value.length > 1) {
                            author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + '. and ' + firstNames[1].value + ' ' + middleNames[1].value + ' ' + lastNames[1].value + '. ';
                        } else {
                            author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + '. and ' + firstNames[1].value + ' ' + middleNames[1].value + '. ' + lastNames[1].value + '. ';
                        }
                    }

                } else if (middleNames[0].value == '' && middleNames[1].value != '') {
                    if (middleNames[1].value.length > 1) {
                        author = author + lastNames[0].value + ', ' + firstNames[0].value + ' and ' + firstNames[1].value + ' ' + middleNames[1].value + ' ' + lastNames[1].value + '. ';
                    } else {
                        author = author + lastNames[0].value + ', ' + firstNames[0].value + ' and ' + firstNames[1].value + ' ' + middleNames[1].value + '. ' + lastNames[1].value + '. ';
                    }

                } else if (middleNames[0].value != '' && middleNames[1].value == '') {
                    if (middleNames[0].value.length > 1) {
                        author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + ' and ' + firstNames[1].value + ' ' + lastNames[1].value + '. ';
                    } else {
                        author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + '. and ' + firstNames[1].value + ' ' + lastNames[1].value + '. ';
                    }

                } else {
                    author = author + lastNames[0].value + ', ' + firstNames[0].value + ' and ' + firstNames[1].value + ' ' + lastNames[1].value + '. ';
                }

            } else {
                if (middleNames[0].value != '') {
                    if (middleNames[0].value.length > 1) {
                        author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + ', ' + 'et al. ';
                    } else {
                        author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + ', ' + 'et al. ';
                    }
                } else {
                    author = author + lastNames[0].value + ', ' + firstNames[0].value + ', ' + 'et al. ';
                }
            }
        }

        //Title
        var articleTitle = document.getElementById('articleTitle').value;
        if (document.getElementById('type').innerHTML == 'Webpage') {
            if (articleTitle.substring(articleTitle.length - 1) != '.' && articleTitle.substring(articleTitle.length - 1) != '?' && articleTitle.substring(articleTitle.length - 1) != '!') {
                page = page + '"' + articleTitle + '.' + '" ';
            } else {
                page = page + '"' + articleTitle + '" ';
            }

        } else {
            if (articleTitle.substring(articleTitle.length - 1) != '.' && articleTitle.substring(articleTitle.length - 1) != '?' && articleTitle.substring(articleTitle.length - 1) != '!') {
                page = page + articleTitle + '. ';
            } else {
                page = page + articleTitle + ' ';
            }
        }

        //Website/Book Information
        if (document.getElementById('type').innerHTML == 'Webpage') {
            if (document.getElementById('publisher').value != '') {
                website = website + document.getElementById('webTitle').value + ', ' + document.getElementById('publisher').value + ', ';
            } else {
                website = website + document.getElementById('webTitle').value + ', ';
            }
        } else {
            if (document.getElementById('publisher').value != '') {
                website = website + document.getElementById('publisher').value + ', ';
            }
        }

        //Date Published
        var dateP = document.getElementById('datePublished').getElementsByTagName('input');
        if (document.getElementById('type').innerHTML == 'Webpage') {
            if (dateP[0].value != '' && dateP[1].value != '' && dateP[2].value != '') {
                if (dateP[0].value.length > 3) {
                    datePublished = datePublished + dateP[1].value + ' ' + dateP[0].value.substring(0, 3) + '. ' + dateP[2].value + ', ';
                } else {
                    datePublished = datePublished + dateP[1].value + ' ' + dateP[0].value + ' ' + dateP[2].value + ', ';
                }
            }
        } else {
            if (dateP[2].value != '') {
                datePublished = datePublished + dateP[2].value + '.';
            }
        }

        //URL
        if (document.getElementById('URL').value.substring(0, 8) == 'https://') {
            url = url + document.getElementById('URL').value.substring(8) + '. ';
        } else {
            url = url + document.getElementById('URL').value + '. ';
        }

        //Date Accessed
        var dateA = document.getElementById('dateAccessed').getElementsByTagName('input');
        if (dateA[0].value != '' && dateA[1].value != '' && dateA[2].value != '') {
            if (dateA[0].value.length > 3) {
                dateAccessed = dateAccessed + 'Accessed ' + dateA[1].value + ' ' + dateA[0].value.substring(0, 3) + '. ' + dateA[2].value + '.';
            } else {
                dateAccessed = dateAccessed + 'Accessed ' + dateA[1].value + ' ' + dateA[0].value + ' ' + dateA[2].value + '.';
            }
        }

        if (document.getElementById('type').innerHTML == 'Webpage') {
            if (articleTitle != '' && document.getElementById('URL').value != '' && document.getElementById('webTitle').value != '' && ((dateP[0].value != '' && dateP[1].value != '' && dateP[2].value != '') || (dateA[0].value != '' && dateA[1].value != '' && dateA[2].value != ''))) {
                var source = author + page + website + datePublished + url + dateAccessed;
            }
        } else {
            if (articleTitle != '' && dateP[2].value != '') {
                var source1 = author;
                var italics = '##' + page + '%%'; //Allows datastore to tell what to italicize

                if (dateP[2].value == '') {
                    var source2 = website + dateAccessed;
                } else {
                    var source2 = website + datePublished;
                }

                var source = source1 + italics + source2;
            }
        }

        //APA
    } else if (document.getElementById('format').innerHTML == 'APA') {
        var firstNames = document.getElementsByClassName('firstName');
        var middleNames = document.getElementsByClassName('middleName');
        var lastNames = document.getElementsByClassName('lastName');

        //Author Name(s)
        if (firstNames[0].value != '' && lastNames[0].value != '') {
            if (firstNames.length == 1) {
                if (middleNames[0].value != '') {
                    author = author + lastNames[0].value + ', ' + firstNames[0].value.substring(0, 1) + '. ' + middleNames[0].value.substring(0, 1) + '. ';
                } else {
                    author = author + lastNames[0].value + ', ' + firstNames[0].value.substring(0, 1) + '. ';
                }
            } else if (firstNames.length < 7) {
                for (var i = 0; i < firstNames.length; i++) {
                    if (i < firstNames.length - 1) {
                        if (middleNames[i].value != '') {
                            author = author + lastNames[i].value + ', ' + firstNames[i].value.substring(0, 1) + '. ' + middleNames[i].value.substring(0, 1) + '., ';
                        } else {
                            author = author + lastNames[i].value + ', ' + firstNames[i].value.substring(0, 1) + '., ';
                        }

                    } else {
                        if (middleNames[i].value != '') {
                            author = author + '& ' + lastNames[i].value + ', ' + firstNames[i].value.substring(0, 1) + '. ' + middleNames[i].value.substring(0, 1) + '. ';
                        } else {
                            author = author + '& ' + lastNames[i].value + ', ' + firstNames[i].value.substring(0, 1) + '. ';
                        }
                    }
                }
            } else {
                for (var i = 0; i < firstNames.length; i++) {
                    if (i < 6) {
                        if (middleNames[i].value != '') {
                            author = author + lastNames[i].value + ', ' + firstNames[i].value.substring(0, 1) + '. ' + middleNames[i].value.substring(0, 1) + '., ';
                        } else {
                            author = author + lastNames[i].value + ', ' + firstNames[i].value.substring(0, 1) + '., ';
                        }
                    } else if (i == firstNames.length - 1) {
                        if (middleNames[i].value != '') {
                            author = author + '. . . ' + lastNames[i].value + ', ' + firstNames[i].value.substring(0, 1) + '. ' + middleNames[i].value.substring(0, 1) + '. ';
                        } else {
                            author = author + '. . . ' + lastNames[i].value + ', ' + firstNames[i].value.substring(0, 1) + '. ';
                        }
                    }
                }
            }
        }

        //Date Published
        var dateP = document.getElementById('datePublished').getElementsByTagName('input');
        if (dateP[2].value != '') {
            datePublished = datePublished + '(' + dateP[2].value + '). ';
        } else {
            datePublished = datePublished + '(n.d.). ';
        }

        //Title
        var articleTitle = document.getElementById('articleTitle').value;
        if (articleTitle.substring(articleTitle.length - 1) != '.' && articleTitle.substring(articleTitle.length - 1) != '?' && articleTitle.substring(articleTitle.length - 1) != '!') {
            page = page + articleTitle + '. ';
        } else {
            page = page + articleTitle + ' ';
        }

        //Book Information
        if (document.getElementById('publisher').value != '' && document.getElementById('webTitle').value != '') {
            website = website + document.getElementById('webTitle').value + ': ' + document.getElementById('publisher').value + '.';
        }

        //Date Accessed
        var dateA = document.getElementById('dateAccessed').getElementsByTagName('input');
        if (dateA[0].value != '' && dateA[1].value != '' && dateA[2].value != '') {
            dateAccessed = dateAccessed + 'Retrieved ' + dateA[0].value + ' ' + dateA[1].value + ', ' + dateA[2].value + ', ';
        } else {
            dateAccessed = dateAccessed + 'Retrieved ';
        }

        //URL
        url = url + 'from ' + document.getElementById('URL').value;

        if (document.getElementById('type').innerHTML == 'Webpage') {
            if (articleTitle != '' && document.getElementById('URL').value != '' && (dateP[2].value != '' || (dateA[0].value != '' && dateA[1].value != '' && dateA[2].value != ''))) {
                if (author.value == '') {
                    var source = page + datePublished + dateAccessed + url;
                } else {
                    var source = author + datePublished + page + dateAccessed + url;
                }
            }
        } else {
            if (articleTitle != '' && dateP[2].value != '') {
                var source1 = author + datePublished + '';
                var italics = '##' + page + '%%'; //Allows datastore to tell what to italicize
                var source2 = website;

                var source = source1 + italics + source2;
            }
        }

        //Chicago
    } else if (document.getElementById('format').innerHTML == 'Chicago 17th') {
        if (document.getElementById('note').innerHTML == 'Footnote') {
            var useCommas = true;
        } else {
            var useCommas = false;
        }

        var firstNames = document.getElementsByClassName('firstName');
        var middleNames = document.getElementsByClassName('middleName');
        var lastNames = document.getElementsByClassName('lastName');

        //Author Name(s)
        if (firstNames[0].value != '' && lastNames[0].value != '') {
            if (firstNames.length == 1) {
                if (middleNames[0].value != '') {
                    if (middleNames[0].value.substring(1, 2) == '.') {
                        if (useCommas) {
                            author = author + firstNames[0].value + ' ' + middleNames[0].value + ' ' + lastNames[0].value + ', ';
                        } else {
                            author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + ' ';
                        }
                    } else {
                        if (useCommas) {
                            author = author + firstNames[0].value + ' ' + middleNames[0].value + ' ' + lastNames[0].value + ', ';
                        } else {
                            author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + '. ';
                        }
                    }
                } else {
                    if (useCommas) {
                        author = author + firstNames[0].value + ' ' + lastNames[0].value + ', ';
                    } else {
                        author = author + lastNames[0].value + ', ' + firstNames[0].value + '. ';
                    }

                }

            } else if (2 <= firstNames.length <= 3) {
                for (var i = 0; i < firstNames.length; i++) {
                    if (i = 0) {
                        if (firstNames.length == 2) {
                            if (middleNames[i].value != '') {
                                if (middleNames[i].value.substring(1, 2) == '.' || middleNames[i].length > 1) {
                                    if (useCommas) {
                                        author = author + firstNames[i].value + ' ' + middleNames[i].value + ' ' + lastNames[i].value + ' and ';
                                    } else {
                                        author = author + lastNames[i].value + ', ' + firstNames[i].value + ' ' + middleNames[i].value + ' and ';
                                    }
                                } else {
                                    if (useCommas) {
                                        author = author + firstNames[i].value + ' ' + middleNames[i].value + ' ' + lastNames[i].value + '. and ';
                                    } else {
                                        author = author + lastNames[i].value + ', ' + firstNames[i].value + ' ' + middleNames[i].value + '. and ';
                                    }
                                }
                            } else {
                                if (useCommas) {
                                    author = author + ', ' + firstNames[i].value + ' ' + lastNames[i].value + ' and ';
                                } else {
                                    author = author + lastNames[i].value + ', ' + firstNames[i].value + ' and ';
                                }
                            }

                        } else {
                            if (middleNames[i].value != '') {
                                if (middleNames[i].length > 1) {
                                    if (useCommas) {
                                        author = author + firstNames[i].value + ' ' + middleNames[i].value + ' ' + lastNames[i].value + ', ';
                                    } else {
                                        author = author + lastNames[i].value + ', ' + firstNames[i].value + ' ' + middleNames[i].value + ', ';
                                    }
                                } else {
                                    if (useCommas) {
                                        author = author + firstNames[i].value + ' ' + middleNames[i].value + ' ' + lastNames[i].value + '., ';
                                    } else {
                                        author = author + lastNames[i].value + ', ' + firstNames[i].value + ' ' + middleNames[i].value + '., ';
                                    }
                                }
                            } else {
                                if (useCommas) {
                                    author = author + firstNames[i].value + ' ' + lastNames[i].value + ', ';
                                } else {
                                    author = author + lastNames[i].value + ', ' + firstNames[i].value + ', ';
                                }
                            }
                        }

                    } else {
                        if (firstNames.length == 2 || (firstNames.length == 3 && i == 2)) {
                            if (middleNames[i].value != '') {
                                if (middleNames[i].length > 1) {
                                    if (useCommas) {
                                        author = author + firstNames[i].value + ' ' + middleNames[i].value + ' ' + lastNames[i].value + ', ';
                                    } else {
                                        author = author + firstNames[i].value + ' ' + middleNames[i].value + ' ' + lastNames[i].value + '. ';
                                    }
                                } else {
                                    if (useCommas) {
                                        author = author + firstNames[i].value + ' ' + middleNames[i].value + '. ' + lastNames[i].value + ', ';
                                    } else {
                                        author = author + firstNames[i].value + ' ' + middleNames[i].value + '. ' + lastNames[i].value + '. ';
                                    }
                                }
                            } else {
                                if (useCommas) {
                                    author = author + firstNames[i].value + ' ' + lastNames[i].value + ', ';
                                } else {
                                    author = author + firstNames[i].value + ' ' + lastNames[i].value + '. ';
                                }
                            }
                        } else {
                            if (middleNames[i].value != '') {
                                if (middleNames[i].length > 1) {
                                    author = author + firstNames[i].value + ' ' + middleNames[i].value + ' ' + lastNames[i].value + ', and ';
                                } else {
                                    author = author + firstNames[i].value + ' ' + middleNames[i].value + '. ' + lastNames[i].value + ', and ';
                                }
                            } else {
                                author = author + firstNames[i].value + ' ' + lastNames[i].value + ', and ';
                            }
                        }
                    }
                }

            } else {
                if (middleNames[0].value != '') {
                    if (useCommas) {
                        author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + ', ' + 'et al., ';
                    } else {
                        author = author + lastNames[0].value + ', ' + firstNames[0].value + ' ' + middleNames[0].value + ', ' + 'et al. ';
                    }
                } else {
                    if (useCommas) {
                        author = author + lastNames[0].value + ', ' + firstNames[0].value + ', ' + 'et al., ';
                    } else {
                        author = author + lastNames[0].value + ', ' + firstNames[0].value + ', ' + 'et al. ';
                    }
                }
            }
        }

        //Title
        var articleTitle = document.getElementById('articleTitle').value;
        if (document.getElementById('type').innerHTML == 'Webpage') {
            if (articleTitle.substring(articleTitle.length - 1) != '.' && articleTitle.substring(articleTitle.length - 1) != '?' && articleTitle.substring(articleTitle.length - 1) != '!') {
                if (useCommas) {
                    page = page + '"' + articleTitle + ',' + '" ';
                } else {
                    page = page + '"' + articleTitle + '.' + '" ';
                }
            } else {
                if (useCommas) {
                    page = page + '"' + articleTitle + ',' + '" ';
                } else {
                    page = page + '"' + articleTitle + '" ';
                }
            }

        } else {
            if (articleTitle.substring(articleTitle.length - 1) != '.' && articleTitle.substring(articleTitle.length - 1) != '?' && articleTitle.substring(articleTitle.length - 1) != '!') {
                if (useCommas) {
                    page = page + articleTitle + ' ';
                } else {
                    page = page + articleTitle + '. ';
                }
            } else {
                if (useCommas) {
                    page = page + articleTitle + ' ';
                } else {
                    page = page + articleTitle + ' ';
                }
            }
        }

        //Website/Book Information
        if (document.getElementById('type').innerHTML == 'Webpage') {
            if (document.getElementById('publisher').value != '') {
                if (useCommas) {
                    website = website + document.getElementById('webTitle').value + ', ' + document.getElementById('publisher').value + ', ';
                } else {
                    website = website + document.getElementById('webTitle').value + ', ' + document.getElementById('publisher').value + '. ';
                }
            } else {
                if (useCommas) {
                    website = website + document.getElementById('webTitle').value + ', ';
                } else {
                    website = website + document.getElementById('webTitle').value + '. ';
                }
            }
        } else {
            if (document.getElementById('publisher').value != '' && document.getElementById('webTitle').value != '') {
                website = website + document.getElementById('webTitle').value + ': ' + document.getElementById('publisher').value + ', ';
            }
        }

        //Date Published
        var dateP = document.getElementById('datePublished').getElementsByTagName('input');
        if (document.getElementById('type').innerHTML == 'Webpage') {
            if (dateP[0].value != '' && dateP[1].value != '' && dateP[2].value != '') {
                if (useCommas) {
                    datePublished = datePublished + 'last modified ' + dateP[0].value + ' ' + dateP[1].value + ', ' + dateP[2].value + ', ';
                } else {
                    datePublished = datePublished + 'Last modified ' + dateP[0].value + ' ' + dateP[1].value + ', ' + dateP[2].value + '. ';
                }
            }
        } else {
            if (dateP[2].value != '') {
                datePublished = datePublished + dateP[2].value;
            }
        }

        //URL
        url = url + document.getElementById('URL').value + '. ';

        //Date Accessed
        var dateA = document.getElementById('dateAccessed').getElementsByTagName('input');
        if (dateA[0].value != '' && dateA[1].value != '' && dateA[2].value != '') {
            if (useCommas) {
                dateAccessed = dateAccessed + 'accessed ' + dateA[0].value + ' ' + dateA[1].value + ' ' + dateA[2].value + ', ';
            } else {
                dateAccessed = dateAccessed + 'Accessed ' + dateA[0].value + ' ' + dateA[1].value + ' ' + dateA[2].value + '. ';
            }
        }

        if (document.getElementById('type').innerHTML == 'Webpage') {
            if (articleTitle != '' && document.getElementById('URL').value != '' && document.getElementById('webTitle').value != '' && ((dateP[0].value != '' && dateP[1].value != '' && dateP[2].value != '') || (dateA[0].value != '' && dateA[1].value != '' && dateA[2].value != ''))) {
                var source = author + page + website + datePublished + dateAccessed + url;
            }
        } else {
            if (articleTitle != '' && dateP[2].value != '') {
                var source1 = '' + author;
                var italics = '##' + page + '%%'; //Allows datastore to tell what to italicize

                if (useCommas) {
                    var source2 = '(' + website + datePublished + ').';
                } else {
                    var source2 = website + datePublished + '.';
                }

                var source = source1 + italics + source2;
            }
        }
    }
    return source;
}

function backButton() {
    document.getElementById('doc').style.display = 'none';
    document.getElementById('home').style.display = 'block';
}

window.onload = function() {
    $('#add-source').on('click', addSource);
    $('#add-author').on('click', addAuthor);

    $('.dropdownContent:first a').on('click', function() {
        $('#format').html($(this).html());
    });

    $('.dropdownContent:eq(1) a').on('click', function () {
        $('#type').html($(this).html());
    });

    $('.dropdownContent:last a').on('click', function () {
        $('#note').html($(this).html());
    });

    $('#closeAddSource').on('click', closeAddSource);
    $('#openAddSource').on('click', openAddSource);

    $('#openEditSourceSettings').on('click', openEditSourceSettings);
    $('#closeEditSourceSettings').on('click', closeEditSourceSettings);
    $('#editSources').on('click', editSources);

    $('#openAddDoc').on('click', openAddDoc);
    $('#closeAddDoc').on('click', closeAddDoc);
    $('#addDoc').on('click', addDoc);

    $('#documents .document').on('click', openDoc);
    $('#backButton').on('click', backButton);

    $('#signOut').on('click', logOut);
}

$(document).on('click', '.deleteBtn', function() {
    var $row = $(this).parent('.row');
    var $br = $row.prev();
    $row.remove();
    $br.remove();
});

function logOut() {
    firebase.auth().signOut().then(function () {
        console.log("Sign out successful");
        window.location.replace("home.html");
    }, function (error) {
        console.log(error);
    });
}