let x = '5㐀㒣㕴㕵㙉㙊🐼';

var textElement = document.createElement('p');
textElement.textContent = x;

var section = document.querySelector('section');
section.appendChild(textElement);
