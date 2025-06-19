const visitsFilters = {
    filterOpStudentId: function(visits, studentId) {
        return visits.filter(v => v.student_id === studentId);
    },
    filterOpBedrijfId: function(visits, bedrijfId) {
        return visits.filter(v => v.bedrijf_id === bedrijfId);
    },
};
module.exports = visitsFilters;