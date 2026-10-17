# Usage: python3 -I dump-bin.py <file.bin>  -- lists entries of a haptobin .bin (format read from haptobin_tool.jar BinaryTool bytecode)
import sys, struct
b = open(sys.argv[1], 'rb').read(); p = 0
magic = b[p]; p += 1
n = struct.unpack('>i', b[p:p+4])[0]; p += 4
print('magic=0x%02x bundle=%s' % (magic, b[p:p+n].decode())); p += n
while p < len(b):
    n = struct.unpack('>i', b[p:p+4])[0]; p += 4; name = b[p:p+n].decode(); p += n
    n = struct.unpack('>i', b[p:p+4])[0]; p += 4; parent = b[p:p+n].decode(); p += n
    size = struct.unpack('>q', b[p:p+8])[0]; p += 8; p += size
    print('%8d  %s/%s' % (size, parent, name))
print('end offset', p, 'file size', len(b))
