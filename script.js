document.addEventListener("DOMContentLoaded", () => {
    const imageInput = document.getElementById("imageInput");
    const convertButton = document.getElementById("convertButton");
    const outputSection = document.getElementById("outputSection");
    const convertedImagesContainer = document.getElementById("convertedImages");
    const downloadLink = document.getElementById("downloadLink");
    const statusMessage = document.getElementById("statusMessage");
    const widthInput = document.getElementById("width");
    const heightInput = document.getElementById("height");
    const sizePercentageInput = document.getElementById("sizePercentage");
    const progressBar = document.getElementById("progressBar");
    const progressText = document.getElementById("progressText");
    const progressSection = document.getElementById("progressSection");

    // Function to convert image to WEBP with custom dimensions and size percentage
    async function convertToWebP(file, width, height, sizePercentage) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.src = event.target.result;

                img.onload = () => {
                    let canvasWidth, canvasHeight;

                    if (width && height) {
                        canvasWidth = width;
                        canvasHeight = height;
                    } else if (sizePercentage) {
                        const scale = sizePercentage / 100;
                        canvasWidth = Math.floor(img.width * scale);
                        canvasHeight = Math.floor(img.height * scale);
                    } else {
                        canvasWidth = img.width;
                        canvasHeight = img.height;
                    }

                    const canvas = document.createElement("canvas");
                    canvas.width = canvasWidth;
                    canvas.height = canvasHeight;

                    const ctx = canvas.getContext("2d");
                    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

                    canvas.toBlob(
                        (blob) => {
                            if (blob) {
                                resolve(blob);
                            } else {
                                reject(new Error("Failed to convert to WEBP"));
                            }
                        },
                        "image/webp",
                        0.95
                    );
                };
            };

            reader.onerror = () => reject(reader.error);
            reader.readAsDataURL(file);
        });
    }

    // Handle file input change
    imageInput.addEventListener("change", (event) => {
        const files = Array.from(event.target.files).slice(0, 5);
        if (files.length > 0 && files.every((file) => file.type.startsWith("image/"))) {
            convertButton.disabled = false;
            statusMessage.textContent = "";
        } else {
            convertButton.disabled = true;
            statusMessage.textContent = "Please select up to 5 valid image files.";
        }
    });

    // Handle conversion button click
    convertButton.addEventListener("click", async () => {
        const files = Array.from(imageInput.files).slice(0, 5);
        const width = parseInt(widthInput.value) || null;
        const height = parseInt(heightInput.value) || null;
        const sizePercentage = parseInt(sizePercentageInput.value) || 100;

        if (files.length === 0) {
            statusMessage.textContent = "Please select at least one image file.";
            return;
        }

        try {
            statusMessage.textContent = "Converting... Please wait.";
            progressSection.style.display = "block";
            progressBar.value = 0;
            progressText.textContent = `Progress: 0%`;

            const zip = new JSZip();
            const totalFiles = files.length;
            let completedFiles = 0;

            for (let i = 0; i < totalFiles; i++) {
                const file = files[i];
                const webpBlob = await convertToWebP(file, width, height, sizePercentage);

                zip.file(`converted_${file.name.split(".")[0]}.webp`, webpBlob);

                const webpUrl = URL.createObjectURL(webpBlob);
                const imgElement = document.createElement("img");
                imgElement.src = webpUrl;
                imgElement.alt = `Converted ${file.name}`;
                convertedImagesContainer.appendChild(imgElement);

                completedFiles++;
                const progress = Math.round((completedFiles / totalFiles) * 100);
                progressBar.value = progress;
                progressText.textContent = `Progress: ${progress}%`;
            }

            const zipContent = await zip.generateAsync({ type: "blob" });
            downloadLink.href = URL.createObjectURL(zipContent);
            downloadLink.download = "converted_images.zip";

            outputSection.style.display = "block";
            statusMessage.textContent = "Conversion successful! You can now download the ZIP file.";
        } catch (error) {
            statusMessage.textContent = `Error: ${error.message}`;
        } finally {
            progressSection.style.display = "none";
        }
    });
});