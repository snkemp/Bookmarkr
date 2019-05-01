/*file for logic of extension
 *
 *
 */

chEx = chrome.extension;
var urls = [], urlss = [];

//gets called first
document.addEventListener('DOMContentLoaded', function() {
	var c = document.getElementById('checkall');
	c.addEventListener('change', checkAll);
	var d = document.getElementById('populateList');
	d.addEventListener('click', pop);
	var e = document.getElementById('submit');
	e.addEventListener('click', format);
	var f = document.getElementById('addUrls');
	f.addEventListener('click', addUrls);
	var g = document.getElementById('clearUrls');
	g.addEventListener('click', set);
	
	//urls = ["google.com", "stetson.edu", "hackStetson.edu"];
	populate(urls);
});

function set() {urls=[];}
function setup() {
	chrome.bookmarks.getTree(function(tree){
		for (var i = 0; i < tree[0].children.length; i++){
			getChildren(tree[0].children[i].id);
		}
	});	
}

function getChildren(id){
	//chEx.getBackgroundPage().console.log("in children: " + id);
	chrome.bookmarks.getSubTree(id, function(subTree )
	{
		//chEx.getBackgroundPage().console.log("subTree: " + subTree[0].url);
		if (subTree[0].url != undefined) 
		{
			//chEx.getBackgroundPage().console.log("im a child");
			urls.push(subTree[0].url);
			//chEx.getBackgroundPage().console.log(urls);
		}
		else
		{
			chrome.bookmarks.getChildren(id, function(childs)
				{
					for (var k = 0; k < childs.length; k++)
					{
						getChildren(childs[k].id);
					}
				});
		}
	});
}

function pop(){populate(null);};
function populate(urlsStr){
	setup();
	if(urlsStr == null) urlsStr = urls;
	var user = document.getElementById('urlsToAdd').innerHTML;
	var div = document.getElementById('table');
	div.innerHTML = '';
	var table = document.createElement('table');
	
	for(var i=0; i<urlsStr.length; i++) {
		var tr = document.createElement('tr');
		var td = document.createElement('td');
		var dv = document.createElement('div');
		var chbx = document.createElement('input');
			chbx.type='checkbox';
			
		var span = document.createElement('span');
			span.innerHTML = urlsStr[i];
		
		dv.appendChild(chbx);
		dv.appendChild(span);
		td.appendChild(dv);
		tr.appendChild(td);
		table.appendChild(tr);
	}
	
	div.appendChild(table);
	var c = document.getElementById('checkall');
	c.checked = false;
	urlss = urls;
	urls = [];
}

function checkAll(){
	//This is whether to check everything
	var t = document.getElementById('checkall').checked;
	
	//get all elements input
	var tout = document.getElementsByTagName('input');
	for(var i=0, max=tout.length; i<max;i++) {
		if(tout[i].id == 'checkall' || tout[i].id=='userNames') continue;
		tout[i].checked = t;
	}
}

function format() {
	var div = document.getElementById('table');
	var arr = [];
	//get all elements input
	var tout = document.getElementsByTagName('input');
	for(var i=0, max=tout.length; i<max;i++) {
		if(tout[i].id == 'checkall' || tout[i].id=='urlsToAdd') continue;
		if(tout[i].checked) arr.push(urlss[i-2]);
	}
	
	var msg = '';
	for(var i=0; i<arr.length; i++) {
		msg += '<a>'+arr[i]+'</a></br>';
	}
	if(arr.length > 0) div.innerHTML = msg;
	var c = document.getElementById('checkall');
	c.checked = false;
}

function addUrls() {
	var str = document.getElementById('urlsToAdd');
	chEx.getBackgroundPage().console.log("Str: "+str.value);
	var arr = str.value.split(' ');
	//var arr = [str.value];
	chEx.getBackgroundPage().console.log("Arr: "+arr);
	for(var i=0; i<arr.length; i++) {
		
		chrome.bookmarks.create({
			url: arr[i],
			title: arr[i]
		});
	}
	str.value = '';
}