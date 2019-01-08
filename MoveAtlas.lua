require "lfs"

function getFileExtension( file )
	local dotPos = #file
	for i = #file, 1, -1 do
		if string.sub(file, i, i) == "." then
			dotPos = i
			break
		end
	end
	if dotPos < #file then
		return string.sub(file, dotPos + 1)
	end
	return ""
end

local atlasFiles = {}

function findFileInPath( path, extToFind )
	for file in lfs.dir(path) do
		if file ~= "." and file ~= ".." and file ~= ".svn" then
            local f = path..'\\'..file  
            local attr = lfs.attributes(f)  
            assert (type(attr) == "table")  
            if attr.mode == "directory" then  
                findFileInPath(f, extToFind)  
            elseif attr.mode == "file" then  
                local ext = getFileExtension(f)
                ext = string.lower(ext);
                if ext == extToFind and f ~= "atlas\\res\\font.atlas" then
                	table.insert(atlasFiles, f)
                end
            end  
		end
	end
end


function main()
	lfs.chdir("bin/res")
	local atlasPath = "atlas\\res"
	findFileInPath(atlasPath, "atlas")
	table.sort(atlasFiles)
	for i,file in ipairs(atlasFiles) do
		for j = #file, 1, -1 do
			if "." == string.sub(file, j, j) then
				local dirName = string.sub(file, #atlasPath + 2, j - 1)
				lfs.mkdir(dirName)
				local pngSrc = string.sub(file, 1, -7)..".png"
				-- print(i, file, dirName, pngSrc)
				os.execute("MOVE /Y "..file.." "..dirName)
				os.execute("MOVE /Y "..pngSrc.." "..dirName)
				break
			end
		end
	end
	os.execute("RMDIR /S /Q atlas")
end

main()