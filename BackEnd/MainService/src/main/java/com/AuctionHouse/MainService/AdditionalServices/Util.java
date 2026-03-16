package com.AuctionHouse.MainService.AdditionalServices;

import java.util.*;

public class Util {

    public static boolean chkIsObjNull(Object obj) {
        if(obj==null) return true;
        return false;
    }

    public static boolean chkIsStrEmpty(String str) {
        if(str==null) return true;

        if(str.length()==0) return true;
        return false;
    }

    public static boolean chkIsStrEmptyInArr(String[] arr) {
        for(String x:arr) {
            if (x == null) return true;
            if (x.length() == 0) return true;
        }
        return false;
    }

    public static boolean chkIsStrEmptyInList(List<String> arr) {
        for(String x:arr) {
            if (x == null) return true;
            if (x.length() == 0) return true;
        }
        return false;
    }

}
