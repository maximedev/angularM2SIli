package net.calendar.application.web.controller;

import net.calendar.application.model.Application;

import org.springframework.http.HttpStatus;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ConcurrentSkipListMap;
import java.util.concurrent.atomic.AtomicLong;


@Controller
public class ApplicationController {

    /*
     * Récupération d'une requete REST 
     */
	
    @RequestMapping(value = "/rest/", method = RequestMethod.GET, produces = "application/json")
    public @ResponseBody Object getCalendar() {
     //   Calendar c = new Calendar();
        return null;
    }


}
