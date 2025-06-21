const bedrijfFilters = {
    // Filter op sector
    filterOpSector: function(bedrijven, sector) {
        if (sector === 'all') return bedrijven;
        return bedrijven.filter(bedrijf => bedrijf.sector === sector);
    },

    // Filter op bedrijfsnaam
    filterOpBedrijfsnaam: function(bedrijven, zoekterm) {
        return bedrijven.filter(bedrijf => 
            bedrijf.naam.toLowerCase().includes(zoekterm.toLowerCase())
        );
    },

    // Filter op locatie
    filterOpLocatie: function(bedrijven, locatie) {
        return bedrijven.filter(bedrijf => 
            bedrijf.locatie && bedrijf.locatie.toLowerCase().includes(locatie.toLowerCase())
        );
    },

    // Filter op beschikbaarheid
    filterOpBeschikbaarheid: function(bedrijven, beschikbaar) {
        return bedrijven.filter(bedrijf => bedrijf.beschikbaar === beschikbaar);
    },

    // Filter op website
    filterOpWebsite: function(bedrijven, heeftWebsite) {
        return bedrijven.filter(bedrijf => 
            heeftWebsite ? bedrijf.website_url : !bedrijf.website_url
        );
    },

    // Filter op beschrijving lengte
    filterOpBeschrijvingLengte: function(bedrijven, minLengte, maxLengte) {
        return bedrijven.filter(bedrijf => {
            if (!bedrijf.beschrijving) return false;
            const lengte = bedrijf.beschrijving.length;
            return lengte >= minLengte && lengte <= maxLengte;
        });
    }
};

export default bedrijfFilters;