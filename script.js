document.addEventListener('DOMContentLoaded', function() {
    const uploadForm = document.getElementById('uploadForm');
    const outputDiv = document.getElementById('output');

    uploadForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(uploadForm);

        try {
            const response = await fetch('/upload', {
                method: 'POST',
                body: formData
            });

            if (!response.ok) {
                throw new Error('Failed to upload source code.');
            }

            const responseData = await response.json();
            displayDownloadLink(responseData.downloadLink);

        } catch (error) {
            console.error('Error:', error);
        }
    });

    function displayDownloadLink(downloadLink) {
        const downloadHTML = `<p><a href="${downloadLink}" download>Download Modified Firmware</a></p>`;
        outputDiv.innerHTML = downloadHTML;
    }
});
