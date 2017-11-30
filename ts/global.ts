function idEl(elementId:string):HTMLElement {
	return document.getElementById(elementId);
}
function classEls(container:Element, className:string):NodeListOf<HTMLElement> {
	return <NodeListOf<HTMLElement>>container.getElementsByClassName(className);
}
function classEl(container:Element, className:string):HTMLElement {
	return <HTMLElement>container.getElementsByClassName(className)[0];
}
function getEData(element:HTMLElement, name:string):string {
	name = 'data-'+name;

	if(element.hasAttribute(name))
		return element.getAttribute(name);
	
	return null;
}
function setEData(element:HTMLElement, name:string, value:string):void {
	element.setAttribute('data-'+name, value);
}