let selectedImage;

// Event listener for image input change
document.getElementById('imageInput').addEventListener('change', (event) => {
    if (event.target.files && event.target.files[0]) {
        selectedImage = event.target.files[0];

        const reader = new FileReader();
        reader.onload = (e) => {
            document.getElementById('uploadedImage').src = e.target.result;
            document.getElementById('imagePreview').style.display = 'block';
            document.getElementById('step2').style.display = 'block';
            updateTrain(2);
        };
        reader.readAsDataURL(selectedImage);
    }
});

// Function to remove the selected image
function removeImage() {
    document.getElementById('imageInput').value = '';
    document.getElementById('imagePreview').style.display = 'none';
    document.getElementById('step2').style.display = 'none';
    document.getElementById('step3').style.display = 'none';
    document.getElementById('outputImage').style.display = 'none';
    document.getElementById('outputText').innerHTML = ''; // Clear text output
    updateTrain(1);
}

// Function to perform OCR using the selected image
async function performOCR() {
    if (!selectedImage) {
        alert('Please select an image first.');
        return;
    }

    // Show loading spinner
    document.getElementById('loadingSpinner').style.display = 'block';

    const formData = new FormData();
    formData.append('file', selectedImage);

    try {
        // Send the image to the backend for OCR
        const response = await fetch('http://localhost:3000/analyze', {
            method: 'POST',
            body: formData,
        });

        if (response.ok) {
            const result = await response.json();

            // Display the recognized text
            displayRecognizedText(result.text);

            // Display the annotated image
            const outputImage = document.getElementById('outputImage');
            outputImage.src = `data:image/png;base64,${result.image}`;
            outputImage.style.display = 'block';

            // Move to Step 3 to display the results
            document.getElementById('step3').style.display = 'block';
            updateTrain(3);
        } else {
            // If the server returned an error response
            const errorData = await response.json();
            console.error('OCR failed:', errorData.details);
            alert('OCR analysis failed. Check console for details.');
        }
    } catch (error) {
        console.error('Error during OCR:', error);
        alert('There was an error performing OCR. Please try again.');
    } finally {
        // Hide loading spinner
        document.getElementById('loadingSpinner').style.display = 'none';
    }
}

// Function to display recognized text in the UI
function displayRecognizedText(recognizedText) {
    const outputText = document.getElementById('outputText');
    outputText.innerHTML = ''; // Clear previous text

    if (recognizedText.trim() !== '') {
        const lines = recognizedText.split('\n');
        lines.forEach((line, index) => {
            if (line.trim() !== '') {
                const lineDiv = document.createElement('div');
                lineDiv.classList.add('mb-2');

                lineDiv.innerHTML = `
                    <strong>Line ${index + 1}:</strong> ${line}
                `;
                outputText.appendChild(lineDiv);
            }
        });
    } else {
        outputText.innerHTML = '<p>No text found in the image.</p>';
    }
}

// Function to update the train step indicator
function updateTrain(stepNumber) {
    const steps = document.querySelectorAll('.train-step');
    const connectors = document.querySelectorAll('.connector');

    steps.forEach((step, index) => {
        if (index < stepNumber) {
            step.classList.add('step-active');
        } else {
            step.classList.remove('step-active');
        }
    });

    connectors.forEach((connector, index) => {
        if (index < stepNumber - 1) {
            connector.classList.add('connector-active');
        } else {
            connector.classList.remove('connector-active');
        }
    });
}
