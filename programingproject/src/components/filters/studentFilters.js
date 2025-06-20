const studentFilters = {
    filterOpNaam: function(studenten, zoekterm) {
        return studenten.filter(student => 
            student.naam.toLowerCase().includes(zoekterm.toLowerCase())
        );
    },
    filterOpEmailDomein: function(studenten, domein) {
        return studenten.filter(student => 
            student.email.endsWith(`@${domein}`)
        );
    },
    filterOpTelefoon: function(studenten, heeftTelefoon) {
        return studenten.filter(student => 
            heeftTelefoon ? student.telefoon : !student.telefoon
        );
    },
    filterOpAboutMeLengte: function(studenten, minLengte, maxLengte) {
        return studenten.filter(student => {
            if (!student.aboutMe) return false;
            const lengte = student.aboutMe.length;
            return lengte >= minLengte && lengte <= maxLengte;
        });
    },
    filterOpProfielFoto: function(studenten, heeftFoto) {
        return studenten.filter(student => 
            heeftFoto ? student.foto_url : !student.foto_url
        );
    },
    filterOpGithub: function(studenten, heeftGithub) {
        return studenten.filter(student => 
            heeftGithub ? student.github_url : !student.github_url
        );
    },
    filterOpLinkedin: function(studenten, heeftLinkedin) {
        return studenten.filter(student => 
            heeftLinkedin ? student.linkedin_url : !student.linkedin_url
        );
    },

    filterOpTaal: function(studenten, taal) {
        return studenten.filter(student => 
            student.talen && student.talen.includes(taal)
        );
    },
    filterOpHardSkill: function(studenten, skill) {
        return studenten.filter(student => 
            student.hardskills && student.hardskills.includes(skill)
        );
    },
    filterOpSoftSkill: function(studenten, skill) {
        return studenten.filter(student => 
            student.softskills && student.softskills.includes(skill)
        );
    },
    filterOpCodeertaal: function(studenten, codeertaal) {
        return studenten.filter(student => 
            student.codeertalen && student.codeertalen.includes(codeertaal)
        );
    }
};
module.exports = studentFilters;