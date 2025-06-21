const afspraakFilters = {
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
};

export default afspraakFilters;