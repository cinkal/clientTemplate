require "lfs"

local function start()
	local num = 0
	local dir = lfs.dir("\config_lua")
 	
    for fileName in dir do
    	if fileName ~= "." and fileName ~= ".." then
	   		fileName = string.sub(fileName, 0, -5)
	   		-- print("fileName = ", fileName)
	        require("config_lua." .. fileName)
		end
    end
end
---从这里开始
start()
