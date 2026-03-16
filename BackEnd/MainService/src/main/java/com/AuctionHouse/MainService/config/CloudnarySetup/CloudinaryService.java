package com.AuctionHouse.MainService.config.CloudnarySetup;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.URLDecoder;
import java.nio.charset.StandardCharsets;
import java.util.*;

@Service
public class CloudinaryService {

    @Autowired
    private Cloudinary cloudinary;

    public String upload(MultipartFile file, String fileNamePrefix) throws IOException {

        String publicId = fileNamePrefix + "_" + System.currentTimeMillis();

        Map uploadResult = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", "auction-house-project/items",
                        "resource_type", "image",
                        "public_id", publicId,
                        "unique_filename", true
                )
        );

        return uploadResult.get("secure_url").toString();
    }

    public void deleteByUrl(String imageUrl) throws IOException {

        // remove everything before /upload/
        String publicId = imageUrl.split("/upload/")[1];

        // remove version if present (v123456/)
        if (publicId.startsWith("v")) {
            publicId = publicId.substring(publicId.indexOf("/") + 1);
        }

        // remove extension
        publicId = publicId.substring(0, publicId.lastIndexOf("."));

        publicId = URLDecoder.decode(publicId, StandardCharsets.UTF_8);

        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
}

