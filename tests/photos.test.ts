import {describe,expect,test} from 'bun:test';
import {photoPermissions,projectWeek,shareExpiry,validatePhoto} from '../src/lib/photos';
describe('Photo rules',()=>{
 test('gallery limit 20MB',()=>{expect(validatePhoto({type:'image/jpeg',size:20971520})).toBeNull();expect(validatePhoto({type:'image/jpeg',size:20971521})).not.toBeNull();});
 test('hero limit 10MB',()=>{expect(validatePhoto({type:'image/png',size:10485760},true)).toBeNull();expect(validatePhoto({type:'image/png',size:10485761},true)).not.toBeNull();});
 test('only displayable images',()=>{expect(validatePhoto({type:'application/pdf',size:100})).not.toBeNull();expect(validatePhoto({type:'image/webp',size:100})).toBeNull();});
 test('admin and moderator permissions',()=>{expect(photoPermissions('admin')).toEqual({canUpload:true,canDelete:true,canShare:true,canDownloadZip:true});expect(photoPermissions('moderator')).toEqual({canUpload:true,canDelete:false,canShare:false,canDownloadZip:true});});
 test('client read-only',()=>{expect(photoPermissions('user')).toEqual({canUpload:false,canDelete:false,canShare:false,canDownloadZip:false});});
 test('30 day expiry',()=>{expect(shareExpiry(true,new Date('2026-10-30T12:00:00Z'))).toBe('2026-11-29T12:00:00.000Z');expect(shareExpiry(false)).toBeNull();});
 test('week across year boundary',()=>{expect(projectWeek('2027-01-04T12:00:00Z','2026-12-28')).toBe(2);expect(projectWeek('2026-10-30T12:00:00Z','2026-10-26')).toBe(1);});
});
