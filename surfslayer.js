function createPopupForm(event) {
    event.preventDefault();
    var currentPageUrl = window.location.href;
    var parentDirInput = document.getElementById('parent_dir');
    if (parentDirInput) {
        parentDirInput.value = currentPageUrl;
    }
}

function submitCreateForm() {
    var modal = document.getElementById('createFolderModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function openPostEditPopupForm(event, img, type, size, title, cid, ctype) {
    event.preventDefault();
    var elements = {
        'edit_filethumbnail': img,
        'edit_file_type': type,
        'edit_file_size': size,
        'edit_fileName': title,
        'edit_file_id': cid,
        'edit_file_folder_id': ctype
    };
    
    for (var id in elements) {
        var element = document.getElementById(id);
        if (element) {
            element.value = elements[id];
        }
    }
}

function openEditPopupForm(event, img, ctype, cid, title) {
    event.preventDefault();
    var elements = {
        'edit_thumbnail': img,
        'edit_folderName': title,
        'edit_folder_id': cid,
        'edit_parent': ctype
    };
    
    for (var id in elements) {
        var element = document.getElementById(id);
        if (element) {
            element.value = elements[id];
        }
    }
}

function deleteItem() {
    var parentIdElement = document.getElementById('edit_parent');
    var idElement = document.getElementById('edit_folder_id');
    
    if (!parentIdElement || !idElement) {
        console.error('Required elements not found');
        return;
    }
    
    var parentId = parentIdElement.value;
    var id = idElement.value;
    
    if (confirm("Are you sure you want to delete this item?")) {
        fetch('/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ delete_id: id, parent: parentId })
        })
        .then(response => {
            if (response.ok) {
                window.location.href = response.url;
            } else {
                console.error('Failed to delete item');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

function submitEditForm() {
    var modal = document.getElementById('editFolderModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

function deleteFileItem() {
    var idElement = document.getElementById('edit_file_id');
    var parentIdElement = document.getElementById('edit_file_folder_id');
    
    if (!idElement || !parentIdElement) {
        console.error('Required elements not found');
        return;
    }
    
    var id = idElement.value;
    var parentId = parentIdElement.value;

    if (confirm("Are you sure you want to delete this item?")) {
        fetch('/delete', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ delete_id: id, parent: parentId })
        })
        .then(response => {
            if (response.ok) {
                window.location.href = response.url;
            } else {
                console.error('Failed to delete item');
            }
        })
        .catch(error => {
            console.error('Error:', error);
        });
    }
}

function submitEditFileForm() {
    var modal = document.getElementById('editModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// Lazy loading images
document.addEventListener("DOMContentLoaded", function () {
    let lazyImages = document.querySelectorAll('.lzy_img');
    if (lazyImages.length > 0) {
        let imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    let img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        observer.unobserve(img);
                    }
                }
            });
        });
        lazyImages.forEach(image => {
            imageObserver.observe(image);
        });
    }
});

// jQuery-dependent code - only execute if jQuery is loaded
if (typeof $ !== 'undefined') {
    $(document).ready(function () {
        var folderSearch = $('#folderSearch');
        if (folderSearch.length > 0) {
            folderSearch.on('input', function () {
                const query = $(this).val().trim();
                if (query.length > 0) {
                    searchFolders(query);
                } else {
                    $('#folderDropdown').empty();
                }
            });
        }

        function searchFolders(query) {
            $.ajax({
                url: '/searchDbFol',
                method: 'GET',
                data: { query: query },
                success: function (response) {
                    $('#folderDropdown').empty();
                    $('#folderDropdown').append('<option value="" selected disabled>Select a folder</option>');
                    response.forEach(function (folder) {
                        $('#folderDropdown').append(`<option value="${folder._id}">${folder.name}</option>`);
                    });
                    enableSendButton();
                },
                error: function (err) {
                    console.error('Failed to fetch folder names:', err);
                }
            });
        }

        $('#sendButton').on('click', function () {
            submitSendForm();
        });
    });
}

function enableSendButton() {
    var sendButton = document.getElementById('sendButton');
    if (sendButton) {
        sendButton.disabled = false;
    }
    // jQuery fallback
    if (typeof $ !== 'undefined') {
        $('#sendButton').prop('disabled', false);
    }
}

function submitSendForm() {
    var folderIdElement = document.getElementById('folderId');
    var folderDropdown = document.getElementById('folderDropdown');
    var sendPopupForm = document.getElementById('sendPopupForm');
    var modal = document.getElementById('sendFileModal');
    
    if (folderIdElement && folderDropdown) {
        folderIdElement.value = folderDropdown.value;
    }
    
    if (sendPopupForm) {
        sendPopupForm.submit();
    }
    
    if (modal) {
        modal.style.display = 'none';
    }
}

function checkSendButton() {
    const checkboxes = document.querySelectorAll('.form-check-input');
    let sendButton = document.getElementById('sendButton');
    let selectedIdsElement = document.getElementById('selectedIds');
    let selectedIds = [];

    if (!sendButton || !selectedIdsElement) {
        return;
    }

    checkboxes.forEach(checkbox => {
        if (checkbox.checked) {
            sendButton.disabled = false;
            var dataId = checkbox.getAttribute('data-id');
            if (dataId) {
                selectedIds.push(dataId);
            }
        }
    });

    selectedIdsElement.value = selectedIds.join(',');
}

document.addEventListener("DOMContentLoaded", function () {
    var errorPopup = document.getElementById("errorPopup");
    if (errorPopup) {
        var errorMessageElement = errorPopup.querySelector("strong");
        if (errorMessageElement) {
            var errorMessage = errorMessageElement.innerText.trim();
            if (errorMessage !== "Oh snap! Invalid username or password") {
                errorPopup.style.display = "none";
            }
        }
    }
});

// Plyr video player initialization - only if player element exists
document.addEventListener("DOMContentLoaded", function () {
    var playerElement = document.getElementById('player');
    if (playerElement && typeof Plyr !== 'undefined') {
        const player = new Plyr('#player', {
            controls: ['play', 'progress', 'current-time', 'mute', 'volume', 'fullscreen', 'pip', 'airplay', 'settings', "play-large", 'duration'],
            hideControls: false,
            keyboard: { focused: true, global: true },
            loop: { active: false },
        });
    }
});

// Video player helper functions
function getDownloadLink() {
    const videolink = window.location.href;
    return videolink.replace("/watch/", "/").replace(/\?.*/, "/video.mp4$&");
}

function vlc_player() {
    const openDownloadLink = getDownloadLink();
    const openVlc = `vlc://${openDownloadLink}`;
    window.location.href = openVlc;
}

function mx_player_free() {
    const openDownloadLink = getDownloadLink();
    const openMx = `intent:${openDownloadLink}#Intent;package=com.mxtech.videoplayer.ad;end`;
    window.location.href = openMx;
}

function mx_player_paid() {
    const openDownloadLink = getDownloadLink();
    const openMx = `intent:${openDownloadLink}#Intent;package=com.mxtech.videoplayer.pro;end`;
    window.location.href = openMx;
}

function download() {
    const openDownloadLink = getDownloadLink();
    window.location.href = openDownloadLink;
}

function copyUrl() {
    const url = window.location.href;
    navigator.clipboard.writeText(url)
        .then(() => {
            alert('URL copied to clipboard!');
        })
        .catch((error) => {
            console.error('Failed to copy URL: ', error);
        });
}

function updateVideoSource() {
    const videoElement = document.getElementById('player');
    if (videoElement) {
        const currentUrl = window.location.href;
        const newSrc = currentUrl.replace("/watch/", "/");
        videoElement.src = newSrc;
    }
}

window.addEventListener('load', function() {
    if (window.location.href.includes('/watch/')) {
        updateVideoSource();
    }
});
