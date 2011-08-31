describe('Method findElement()', function(){
   vc = new vCard();
	
	it('should find the first element with that elementName case insensitive', function(){
		var data = [{ name:'beGin', value:'vcard'},{name:'begin',value:'vscars'}];
		var index = vc.findElement(data,'begin');
		
		expect(index).not.toEqual(-1);
		expect(data[index]).toEqual({ name:'beGin', value:'vcard'});
	});
	
	it('should find the first element with that elementName and that elementValue case insensitive', function(){
		var data = [{ name:'beGin', value:'vcard'},{name:'begin',value:'otheR'},{name:'begin',value:'oTHeR'}];
		var index = vc.findElement(data,'begin','other');
		
		expect(index).not.toEqual(-1);
		expect(data[index]).toEqual({name:'begin',value:'otheR'});
	});

	it('should find the first element with that elementName and that elementValue = null case insensitive', function(){
		var data = [{ name:'beGin', value:'vcard'},{name:'begin',value:'otheR'},{name:'begin',value:null}];
		var index = vc.findElement(data,'begin',null);
		
		expect(index).not.toEqual(-1);
		expect(data[index]).toEqual({name:'begin',value:null});
	});
		
	it('should not find non-existing elements', function(){
		var data = [{ name:'beGin', value:'vcard'},{name:'begin',value:'otheR'},{name:'begin',value:null}];
		var index = vc.findElement(data,'pip','pap');
		
		expect(index).toEqual(-1);
	});

});
