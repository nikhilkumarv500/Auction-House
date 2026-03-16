package com.AuctionHouse.MainService.AdditionalServices;

import com.AuctionHouse.MainService.config.CloudnarySetup.CloudinaryService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;


@Component
public class ImageUploadService {

    @Autowired
    CloudinaryService cloudinaryService;

    public String uploadImage(MultipartFile image, String fileNamePrefix) throws IOException {
        return cloudinaryService.upload(image, fileNamePrefix);
    }

    public void deleteImageByUrl(String url) throws IOException {
        cloudinaryService.deleteByUrl(url);
    }

}
