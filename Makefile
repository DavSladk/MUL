.PHONY: clean

clean:
	rm -f xsladk07.zip

zip:
	zip xsladk07.zip index.html README.pdf script.js setup.js webgl.css webgl.js slides.dtd	slides.xml style.css
	zip media.zip audio/* img/* video/*