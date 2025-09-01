<?xml version="1.0" encoding="UTF-8"?>
<xsl:stylesheet xmlns:xsl="http://www.w3.org/1999/XSL/Transform"
    xmlns:xs="http://www.w3.org/2001/XMLSchema"
    xmlns:tei="http://www.tei-c.org/ns/1.0"
    exclude-result-prefixes="xs tei"
    version="2.0">
    
    <!-- <xsl:output method="xml" omit-xml-declaration="yes" indent="yes" /> -->
    <xsl:template match="tei:teiHeader"/>

    <xsl:template match="tei:body">
        <div class="row">
        <div class="col-3"><br/><br/><br/><br/><br/>
            <xsl:for-each select="//tei:add[@place = 'marginleft']">
                <xsl:choose>
                    <xsl:when test="parent::tei:del">
                        <del>
                            <xsl:attribute name="class">
                                <xsl:value-of select="attribute::hand" />
                            </xsl:attribute>
                            <xsl:value-of select="."/></del><br/>
                    </xsl:when>
                    <xsl:otherwise>
                        <span >
                            <xsl:attribute name="class">
                                <xsl:value-of select="attribute::hand" />
                            </xsl:attribute>
                        <xsl:value-of select="."/><br/>
                        </span>
                    </xsl:otherwise>
                </xsl:choose>
            </xsl:for-each> 
        </div>
        <div class="col-9">
            <div class="transcription">
                <xsl:apply-templates select="//tei:div"/>
            </div>
        </div>
        </div> 
    </xsl:template>
    
    <xsl:template match="tei:div">
        <div class="#MWS"><xsl:apply-templates/></div>
    </xsl:template>
    
    <xsl:template match="tei:p">
        <p><xsl:apply-templates/></p>
    </xsl:template>

  
    <xsl:template match="tei:add[@place = 'marginleft']">
        <span class="marginAdd">
            <xsl:apply-templates/>
        </span>
    </xsl:template>
    
    <xsl:template match="tei:del">
        <del>
            <xsl:attribute name="class">
                <xsl:value-of select="@hand"/>
            </xsl:attribute>
            <xsl:apply-templates/>
        </del>
    </xsl:template>
    
    <!-- all the supralinear additions are given in a span with the class supraAdd, make sure to put this class in superscript in the CSS file, -->
    <xsl:template match="tei:add[@place = 'supralinear']">
        <span class="supraAdd">
            <xsl:apply-templates/>
        </span>
    </xsl:template>
    
    
    <!-- add additional templates below, for example to transform the tei:lb in <br/> empty elements, tei:hi[@rend = 'sup'] in <sup> elements, the underlined text, additions with the attribute "overwritten" etc. -->

    <xsl:template match="tei:lb">
        <br/>
            <xsl:apply-templates/>
    </xsl:template>

    <xsl:template match="tei:hi[@rend = 'sup']">
       <sup><xsl:value-of select="."/>
           <xsl:apply-templates/>
       </sup>
     </xsl:template>
    
    <xsl:template match="tei:hi[@rend = 'u']">
       <underlined>
           <xsl:apply-templates/>
        </underlined>
    </xsl:template>

    <xsl:template match="tei:hi[@rend = 'circled']">
        <span class="circled">
            <xsl:value-of select="."/>
            <xsl:apply-templates/>
        </span>
    </xsl:template>

    <xsl:template match="tei:add[@place = 'overwritten']">
        <span class="overadd">
            <xsl:apply-templates/>
        </span>
    </xsl:template>
    
    <!-- Supralinear additions (render via CSS as superscript) -->
    <xsl:template match="tei:add[@place='supralinear']">
        <span class="supraAdd"><xsl:apply-templates/></span>
    </xsl:template>

    <!-- Line breaks -->
    <xsl:template match="tei:lb">
        <br class="lb"/>
    </xsl:template>

    <!-- Superscript (support 'sup' or 'super') -->
    <xsl:template match="tei:hi[@rend=('sup','super')]">
        <sup><xsl:apply-templates/></sup>
    </xsl:template>

    <!-- Underlined text (support 'u' or 'underline') -->
    <xsl:template match="tei:hi[@rend=('u','underline')]">
        <span class="underline"><xsl:apply-templates/></span>
    </xsl:template>

    <!-- Circled text (e.g., circled numerals in running text) -->
    <xsl:template match="tei:hi[@rend='circled']">
        <span class="circled"><xsl:apply-templates/></span>
    </xsl:template>

    <!-- Circled page number on manuscript page:
         Often encoded on <pb>; handle @n plus any hint of 'circled' in @rend or @type -->
    <xsl:template match="tei:pb[@n and (contains(@rend,'circled') or @type='circled')]">
        <span class="pageNo circled">
            <xsl:value-of select="@n"/>
        </span>
    </xsl:template>

    <!-- Overwritten additions:
         Support several encodings: @place='overwritten', @type='overwritten', or an @overwritten flag -->
    <xsl:template match="tei:add[@place='overwritten' or @type='overwritten' or @overwritten]">
        <span class="overwrittenAdd"><xsl:apply-templates/></span>
    </xsl:template>


</xsl:stylesheet>
