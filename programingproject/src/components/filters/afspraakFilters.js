const afspraakFilters = {
    // Filter op datum
    filterOpDatum: function(afspraken, datum) {
        return afspraken.filter(afspraak => afspraak.datum === datum);
    },

    // Filter op datum range
    filterOpDatumRange: function(afspraken, startDatum, eindDatum) {
        return afspraken.filter(afspraak => {
            const afspraakDatum = new Date(afspraak.datum);
            const start = new Date(startDatum);
            const eind = new Date(eindDatum);
            return afspraakDatum >= start && afspraakDatum <= eind;
        });
    },

    // Filter op student naam
    filterOpStudentNaam: function(afspraken, zoekterm) {
        return afspraken.filter(afspraak => 
            afspraak.student_naam.toLowerCase().includes(zoekterm.toLowerCase())
        );
    },

    // Filter op tijdslot
    filterOpTijdslot: function(afspraken, tijdslot) {
        return afspraken.filter(afspraak => afspraak.tijdslot === tijdslot);
    },

    // Filter op context
    filterOpContext: function(afspraken, zoekterm) {
        return afspraken.filter(afspraak => 
            afspraak.context && afspraak.context.toLowerCase().includes(zoekterm.toLowerCase())
        );
    },

    // Filter op email
    filterOpEmail: function(afspraken, emailZoekterm) {
        return afspraken.filter(afspraak => 
            afspraak.student_email && afspraak.student_email.toLowerCase().includes(emailZoekterm.toLowerCase())
        );
    },

    // Filter op vandaag
    filterOpVandaag: function(afspraken) {
        const vandaag = new Date().toISOString().split('T')[0];
        return afspraken.filter(afspraak => afspraak.datum === vandaag);
    },

    // Filter op komende week
    filterOpKomendeWeek: function(afspraken) {
        const vandaag = new Date();
        const volgendeWeek = new Date();
        volgendeWeek.setDate(vandaag.getDate() + 7);
        
        return afspraken.filter(afspraak => {
            const afspraakDatum = new Date(afspraak.datum);
            return afspraakDatum >= vandaag && afspraakDatum <= volgendeWeek;
        });
    },

    // Combineer meerdere filters
    filterCombinatie: function(afspraken, filters) {
        return afspraken.filter(afspraak => {
            return filters.every(filter => filter(afspraak));
        });
    }
};

module.exports = afspraakFilters;