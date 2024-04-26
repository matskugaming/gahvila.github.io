document.addEventListener("DOMContentLoaded", function() {
    var images = ["background1.avif", "background2.avif", "background3.avif", "background4.avif", "background5.avif"];
    images = shuffleArray(images);
    var imageObjects = [];
    var currentIndex = 0;
    var isFirstImageDisplayed = false;

    function shuffleArray(array) {
        for (var i = array.length - 1; i > 0; i--) {
            var j = Math.floor(Math.random() * (i + 1));
            var temp = array[i];
            array[i] = array[j];
            array[j] = temp;
        }
        return array;
    }

    async function preloadImage(url) {
        return new Promise((resolve, reject) => {
            var img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = url;
        });
    }

    async function preloadFirstImage() {
        try {
            const firstImage = await preloadImage("/assets/backgrounds/" + images[0]);
            imageObjects.push(firstImage);
            document.getElementById('background').style.backgroundImage = "url(" + firstImage.src + ")";
            isFirstImageDisplayed = true;
        } catch (error) {
            console.error("Failed to preload the first image:", error);
        }
    }

    async function preloadRemainingImages() {
        try {
            const promises = [];
            for (let i = 1; i < images.length; i++) {
                promises.push(preloadImage("/assets/backgrounds/" + images[i]));
            }
            const loadedImages = await Promise.all(promises);
            imageObjects.push(...loadedImages);
        } catch (error) {
            console.error("Failed to preload the remaining images:", error);
        }
    }

    function changeBackground() {
        if (isFirstImageDisplayed) {
            setTimeout(() => {
                document.getElementById('background').style.opacity = 0;
                setTimeout(function() {
                    document.getElementById('background').style.backgroundImage = "url(" + imageObjects[currentIndex].src + ")";
                    document.getElementById('background').style.opacity = 1;
                }, 500);
                currentIndex = (currentIndex + 1) % images.length;
                setTimeout(changeBackground, 15000);
            }, 15000);
        } else {
            setTimeout(changeBackground, 1000);
        }
    }

    preloadFirstImage().then(() => {
        preloadRemainingImages().then(() => {
            changeBackground();
        });
    }).catch(error => {
        console.error("Failed to preload images:", error);
    });
});
